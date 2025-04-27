import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import PageHeader from "@/common/components/PageHeader";
import Screen from "@/common/components/Screen";
import Title from "@/features/legal/components/Title";
import {ScrollView} from "react-native";
import {spacing} from "@/theme";
import Paragraph from "@/features/legal/components/Paragraph";
import React from "react";
import Spacer from "@/features/legal/components/Spacer";

interface TermsOfServiceProps {

}

const TermsOfService = ({}: TermsOfServiceProps) => {

    const styles: Record<string, ViewStyle> = {
		content: {
			paddingHorizontal: spacing.s,
			paddingBottom: 200
		}
    }

    return(
        <Screen>
			<PageHeader title={"Terms of Service"} Config={<></>} />

	        <ScrollView contentContainerStyle={styles.content}>
		        <Title>
			        GENERAL
		        </Title>
		        <Paragraph>
			        Content: the content of the Website; said content consists among other things, but not exclusively to music, movies, photos, texts, video images provided by DoomDoomTech, Users, Visitors and third parties.
			        Privacy Policy: the privacy policy of DoomDoomTech that is applicable to the (use of) the Website and/or Service.
			        Terms of Service (ToS): these general terms and conditions of DoomDoomTech.
			        DoomDoomTech: Partnership established and having its principal place of business at the address Strandeilandlaan 65, Amsterdam. Chamber of Commerce nr. 94805563.
			        Service: DoomDoomTech provides a website with a technical platform that enables Users to upload and share Content for the purpose as described on the Website.
			        User: the person who visits the Website and registers for using the Service.
			        Visitor: the person who visits the Website.
			        Website: our Website with the domain name www.DoomDoomTech.com
				</Paragraph>

		        <Spacer />
		        <Title>
			        TERMS OF SERVICE AND SCOPE
		        </Title>
		        <Paragraph>
			        The ToS shall apply between DoomDoomTech and the Visitor of the Website and the User of the Service.
			        Any separate agreement between the Visitor and/or User and DoomDoomTech shall prevail over conflicting ToS terms.
			        These ToS shall take precedence over current legal provisions, unless such provisions are legally binding.
			        The ToS applies to the use of the Website and the Service offered by DoomDoomTech.
			        If any provision of the ToS is null or void, the remaining parts shall remain in force, and the voided part shall be replaced by a valid part as closely aligned with the original intent as possible.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        OBJECT OF THE WEBSITE AND SERVICE
		        </Title>
		        <Paragraph>
			        The Website supports the Service.
			        The Service allows Users to upload and promote their music through profiling and ranking as described on the Website.
			        The Service is provided free of charge.
			        DoomDoomTech is not party to any agreement the Visitor or User makes with a third party and cannot be held liable for such agreements.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        COPYRIGHT AND THIRD-PARTY RIGHTS
		        </Title>
		        <Paragraph>
			        Licensing and Permissions: The User is responsible for ensuring that all Content uploaded to the Website and/or Service does not violate third-party copyrights, intellectual property rights, or any other rights.
			        Users must only upload Content for which they hold the necessary rights, permissions, or licenses.
			        If the User uploads copyrighted materials (e.g., music, videos), the User must provide proof of the license or rights upon request.
			        Content Removal: DoomDoomTech reserves the right to remove any Content that infringes third-party rights without notice.
			        If a third party claims that their rights are violated by User-uploaded Content, DoomDoomTech will investigate and may remove the material in question at its sole discretion.
			        Liability for Copyright Infringement: DoomDoomTech is not liable for any copyright violations resulting from User-uploaded Content.
			        Users agree to indemnify and hold DoomDoomTech harmless from any liability or legal claims resulting from uploaded Content that violates the intellectual property rights of others.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        CONTENT MANAGEMENT AND DMCA PROCEDURES
		        </Title>
		        <Paragraph>
			        User Responsibility for Content: Users retain ownership of all Content uploaded but grant DoomDoomTech a non-exclusive, worldwide license to use the Content on the Website and Service.
			        Users must maintain a backup of all uploaded Content.
			        Users agree to hold DoomDoomTech harmless for any loss, corruption, or unauthorized access to their Content.
			        DMCA Compliance: DoomDoomTech complies with the Digital Millennium Copyright Act (DMCA) and other relevant legal frameworks.
			        If DoomDoomTech receives a valid DMCA takedown notice, the infringing Content will be removed or disabled without prior notice.
			        Users will be notified of such action and can file a counter-notice if they believe the removal was in error.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        CONTENT MODERATION AND REMOVAL
		        </Title>
		        <Paragraph>
			        DoomDoomTech reserves the right, but not the obligation, to monitor and review all Content uploaded by Users to ensure compliance with these ToS and applicable laws.
			        DoomDoomTech may, at its sole discretion, remove or block access to any Content that:
			        Violates the ToS or applicable laws.
			        Infringes the intellectual property rights of third parties.
			        Is deemed inappropriate, harmful, or illegal.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        PRIVACY AND USER DATA
		        </Title>
		        <Paragraph>
			        DoomDoomTech collects and uses personal information in accordance with its Privacy Policy.
			        User data may be shared with third parties solely to provide the Service or to comply with legal obligations. DoomDoomTech will not sell personal data to third parties.
			        Users must agree to the Privacy Policy, which is an integral part of these ToS.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        INDEMNIFICATION
		        </Title>
		        <Paragraph>
			        Users shall indemnify and hold DoomDoomTech harmless against any and all claims (both civil and criminal) arising from their actions on the Website or Service, including but not limited to violations of these ToS or infringements of third-party rights.
			        Users agree to be solely responsible for any damages, legal claims, or expenses arising from their actions, including but not limited to copyright infringement.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        LIMITATION OF LIABILITY
		        </Title>
		        <Paragraph>
			        DoomDoomTech shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages that arise from:
			        Access to or use of the Website and/or Service.
			        The loss or corruption of User Content.
			        In the event that DoomDoomTech is found liable for any damages, its liability will be limited to the fullest extent permitted by applicable law.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        TERMINATION OR SUSPENSION OF SERVICE
		        </Title>
		        <Paragraph>
			        DoomDoomTech reserves the right to suspend or terminate access to the Website and/or Service at any time, for any reason, without prior notice.
			        Users will immediately lose access to the Website and/or Service upon termination or suspension.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        MODIFICATIONS TO THE TERMS OF SERVICE
		        </Title>
		        <Paragraph>
			        DoomDoomTech reserves the right to modify these ToS at any time.
			        Users will be notified of material changes, and continued use of the Website and/or Service after changes take effect constitutes acceptance of the updated ToS.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        INTELLECTUAL PROPERTY RIGHTS
		        </Title>
		        <Paragraph>
			        All intellectual property rights related to the Website and/or Service are owned by DoomDoomTech or its licensors.
			        No part of the Website or Service may be duplicated, modified, or distributed without the prior written consent of DoomDoomTech.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        INDEMNIFICATION
		        </Title>
		        <Paragraph>
			        {"The Visitor and/or User shall indemnify and hold DoomDoomTech harmless against all possible claims, both civil-law and criminal-law claims, lodged by third parties resulting from actions of the Visitor and/or User on the Website and/or the Service and/or non-compliance with these ToS or a violation of the national legislation of the country in which the Visitor and/or User is located. \n" +
				        "The Visitor and/or User shall be liable for his/her actions at all times.\n"}
		        </Paragraph>

		        <Spacer />
		        <Title>
			        APPLICABLE LAW AND COMPETENT COURT
		        </Title>
		        <Paragraph>
			        Dutch law shall apply to these ToS. The United Nations Convention on Contracts for the International Sale of Goods (CISG) is excluded.
			        Disputes between the Visitor and DoomDoomTech shall be settled by the competent court in Breda, unless mandatory legal provisions specify otherwise.
		        </Paragraph>

		        <Spacer />
		        <Title>
			        USER CONDUCT AND CONTENT
		        </Title>
		        <Paragraph>
			        Zero Tolerance Policy: DoomDoomTech maintains a strict zero-tolerance policy for objectionable content and abusive behavior. Users agree not to upload, share, or promote any content that is:
			        Illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable
			        Infringing on intellectual property rights of others
			        Violating the privacy or publicity rights of others
			        User Responsibility: Users are solely responsible for the content they upload and share on the platform. By using the Service, users agree to:
			        Comply with all applicable laws and regulations
			        Respect the rights of other users and third parties
			        Maintain a respectful and constructive environment for all users
			        Content Moderation: DoomDoomTech reserves the right to remove any content that violates these terms or is deemed inappropriate at its sole discretion, without prior notice.
			        Reporting and Blocking: Users can report objectionable content or abusive users through the in-app reporting mechanism. Additionally, users have the ability to block other users who engage in abusive behavior.
			        Consequences: Violation of these terms may result in content removal, account suspension, or permanent termination of access to the Service.
			        By using the Service, you agree to abide by these terms and understand that failure to comply may result in the loss of your account and access to the Service.
		        </Paragraph>
	        </ScrollView>
        </Screen>
    )
}

export default TermsOfService