import * as fs from "node:fs";
import {promisify} from 'node:util';
import {htmlToText} from 'nodemailer-html-to-text';
import nodemailer, {Transporter} from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {ROOTDIR} from "../../../index";
import Singleton from "../../../common/classes/injectables/Singleton";
import {inject, singleton} from "tsyringe";
import {ExtendedPrismaClient} from "../../../common/utils/prisma";

const readFileAsync = promisify(fs.readFile);

export interface EmailConfig {
	from: string;
	to: string;
	subject: string;
	template: string;
	variables: Record<string, string>;
	attachments?: Array<{path: string; cid: string}>;
}

export interface IEmailService {
	send(config: EmailConfig): Promise<void>
}

@singleton()
class EmailService extends Singleton implements IEmailService {
	private readonly transporter: Transporter;

	constructor(
		@inject("Database") private db: ExtendedPrismaClient,
	) {
		super()
		this.transporter = this.createTransporter();
		this.transporter.use('compile', htmlToText());
	}

	public async send(config: EmailConfig): Promise<void> {
		try {
			const htmlContent = await this.readMarkup(ROOTDIR + config.template);
			const hydratedHtml = this.hydrateEmailVariables(htmlContent, config.variables);

			await this.transporter.sendMail({
				from: config.from,
				to: config.to,
				subject: config.subject,
				html: hydratedHtml,
				attachments: config.attachments,
			})
		} catch (error) {
			console.log(error)
		}
	}

	private createTransporter(): Transporter {
		return nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: parseInt(process.env.SMTP_PORT || '587'),
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS
			},
			dkim: {
				domainName: "doomdoom.tech",
				keySelector: "2023",
				privateKey: process.env.DKIM_PRIVATE_KEY
			},
		} as SMTPTransport.Options);
	}

	private hydrateEmailVariables(markup: string, values: Record<string, string>): string {
		return Object.entries(values).reduce((acc, [key, value]) => {
			const regex = new RegExp(`{{${key}}}`, 'g');
			return acc.replace(regex, value);
		}, markup);
	}

	private async readMarkup(filePath: string): Promise<string> {
		try {
			return await readFileAsync(filePath, 'utf-8');
		} catch (err) {
			console.error("Error reading HTML file:", err);
			throw new Error('Failed to read HTML file');
		}
	}
}

EmailService.register()