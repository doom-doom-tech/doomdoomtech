import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes'
import PageHeader from "@/common/components/PageHeader";
import Screen from "@/common/components/Screen";
import Title from "@/features/legal/components/Title";
import {ScrollView} from "react-native";
import {spacing} from "@/theme";
import Paragraph from "@/features/legal/components/Paragraph";
import React from "react";
import Spacer from "@/features/legal/components/Spacer";
import Subtitle from "@/features/legal/components/Subtitle";

interface TermsOfServiceProps {

}

const PrivacyPolicy = ({}: TermsOfServiceProps) => {

    const styles: Record<string, ViewStyle> = {
        content: {
            paddingHorizontal: spacing.s,
            paddingBottom: 200
        }
    }

    return(
        <Screen>
            <PageHeader title={"Privacy policy"} Config={<></>} />

            <ScrollView contentContainerStyle={styles.content}>
                <Title>
                    Introduction
                </Title>
                <Paragraph>
                    DoomDoomTech protects its Users (as defined in definition 1.6 of its Terms of Service) by addressing potential privacy concerns. These privacy guidelines apply to all Users as defined in definition 1.6 of DoomDoomTech's Terms of Service. While the content in question may not violate privacy laws in the country or region where the content is uploaded, it may still violate this Privacy Policy.
                </Paragraph>

                <Spacer />
                <Title>
                    Data Collection
                </Title>
                <Subtitle>
                    User-Provided Information
                </Subtitle>
                <Paragraph>
                    {"When a User creates a DoomDoomTech account, the User provides their name, e-mail address, and birthdate. Once registered, Users can visit their profile at any time to add or remove personal information. Even after information is removed or an account is deleted, copies may remain viewable elsewhere when copied or stored by other Users."}
                </Paragraph>

                <Spacer />
                <Subtitle>
                    Metadata
                </Subtitle>
                <Paragraph>
                    If the User does not want DoomDoomTech to store metadata associated with the uploaded content, the User has to remove the metadata before uploading the content.
                </Paragraph>

                <Spacer />
                <Title>
                    Activity Data
                </Title>
                <Paragraph>
                    DoomDoomTech tracks the music or other content the User uploads and the actions the User takes, such as recommending an artist or liking content. DoomDoomTech may also collect information about Users from other Users, such as when a User recommends another User.
                </Paragraph>

                <Spacer />
                <Title>
                    Device Information
                </Title>
                <Paragraph>
                    When a User accesses DoomDoomTech from a computer, tablet, mobile phone, or other device, DoomDoomTech may collect information from that device about the browser type, location, IP address, and pages visited.
                </Paragraph>



                <Spacer />
                <Title>
                    Data Usage
                </Title>
                <Paragraph>
                    DoomDoomTech uses the collected information, data, and uploaded content to provide and improve their services and features.
                </Paragraph>

                <Spacer />
                <Title>
                    Sharing Information
                </Title>
                <Paragraph>
                    DoomDoomTech shares music, content, and information with third parties, such as record labels, when reasonably necessary to offer our services or when legally required.
                </Paragraph>

                <Spacer />
                <Subtitle>
                    Transactional Information
                </Subtitle>
                <Paragraph>
                    When Users enter into transactions to make payments to DoomDoomTech or with third parties, DoomDoomTech will only share transaction information necessary to complete the transaction and will require those third parties to respect the privacy of this information.
                </Paragraph>

                <Spacer />
                <Subtitle>
                    Cookies
                </Subtitle>
                <Paragraph>
                    DoomDoomTech uses cookies to make the website easier to use and to improve advertising.
                </Paragraph>

                <Spacer />
                <Subtitle>
                    Tools for Data Export
                </Subtitle>
                <Paragraph>
                    Users may use tools like RSS feeds or copy and paste functions to capture and export content and information from DoomDoomTech, including other Users' content and information.
                </Paragraph>

                <Spacer />
                <Title>
                    Disclosure to Third Parties
                </Title>
                <Paragraph>
                    At times, DoomDoomTech may make certain personal information available to strategic partners (such as music labels) that work with DoomDoomTech. Personal information will only be shared to provide uploaded content, services, and advertising; it will not be shared with third parties for their marketing purposes.
                </Paragraph>

                <Spacer />
                <Title>
                    Integrity and Retention of Personal Data
                </Title>
                <Paragraph>
                    DoomDoomTech makes it easy for Users to keep their personal information accurate, complete, and up to date. We will retain personal information for the period necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law. After an account is deleted, DoomDoomTech will retain data for a maximum of 90 days to ensure complete removal from all backups and systems.
                </Paragraph>

                <Spacer />
                <Title>
                    Third-Party Sites and Services
                </Title>
                <Paragraph>
                    DoomDoomTech may contain links to third-party websites, products, and services. Information collected by third parties, which may include location data or contact details, is governed by their privacy practices. We encourage Users to learn about the privacy practices of those third parties.
                </Paragraph>

                <Spacer />
                <Title>
                    Questions
                </Title>
                <Paragraph>
                    If you have any questions or concerns about DoomDoomTech’s Privacy Policy or data processing, please contact us via info@doomdoom.tech.
                </Paragraph>

                <Spacer />
                <Title>
                    Policy Updates
                </Title>
                <Paragraph>
                    DoomDoomTech may update its Privacy Policy from time to time. When changes are made in a material way, a notice will be posted on our website along with the updated Privacy Policy.
                </Paragraph>

                <Spacer />
                <Title>
                    Additional Requirements for Apple App Store
                </Title>
                <Paragraph>
                    {"DoomDoomTech may, in its sole discretion, terminate or suspend the use of or access to all or parts of the Website and/or the Service at any time, without notice, for any or no reason, including, without limitation, any breach of these General Terms and Conditions by the Visitor and/or the User.\n" +
                        "Termination or suspension of the use and/or access to the Website and/or the Service causes the right of the Visitor and/or the User to use the Website and/or the Service to expire immediately.\n"}
                </Paragraph>

                <Spacer />
                <Title>
                    MODIFICATIONS OF THE ToS
                </Title>
                <Paragraph>
                    DoomDoomTech ensures compliance with all relevant data protection laws, including GDPR and CCPA, by providing Users with the right to access, correct, delete, and restrict their personal data. Users can exercise these rights by contacting DoomDoomTech’s Data Protection Officer at dpo@doomdoom.tech.
                    For transparency, DoomDoomTech includes a detailed description of how data is encrypted and securely stored. We also provide Users with the option to opt-out of data collection for targeted advertising purposes.
                </Paragraph>

                <Spacer />
                <Title>
                    Children's Privacy
                </Title>
                <Paragraph>
                    DoomDoomTech does not knowingly collect or solicit personal information from anyone under the age of 13. If we become aware that we have collected personal information from a child under 13, we will delete that information as quickly as possible.
                </Paragraph>

                <Spacer />
                <Title>
                    Explicit Data Encryption Methods
                </Title>
                <Paragraph>
                    DoomDoomTech uses advanced encryption standards to protect user data both in transit and at rest. All personal data is encrypted using AES-256 while stored, and HTTPS is used to secure data during transmission.
                </Paragraph>

                <Spacer />
                <Title>
                    User Consent for Data Collection
                </Title>
                <Paragraph>
                    Before collecting any personal data, DoomDoomTech explicitly asks for user consent, ensuring that users are informed about what data will be collected and for what purpose.
                </Paragraph>

                <Spacer />
                <Title>
                    Purpose of Data Collection
                </Title>
                <Paragraph>
                    DoomDoomTech collects data to provide personalized services, improve user experience, and comply with legal requirements. Detailed explanations of each type of data collected and its specific use are provided in the user interface.
                </Paragraph>

                <Spacer />
                <Title>
                    Data Minimization
                </Title>
                <Paragraph>
                    DoomDoomTech commits to collecting only the minimum necessary data required to fulfill the purposes outlined in this Privacy Policy.
                </Paragraph>

                <Spacer />
                <Title>
                    Right to Access and Deletion
                </Title>
                <Paragraph>
                    Users have the right to access, correct, and delete their personal data at any time. Detailed instructions for exercising these rights are available in the account settings or by contacting our Data Protection Officer.
                </Paragraph>

                <Spacer />
                <Title>
                    Data Breach Notification
                </Title>
                <Paragraph>
                    In the event of a data breach, DoomDoomTech will notify affected users within 72 hours and provide detailed information about the breach, its impact, and the measures taken to mitigate it.
                </Paragraph>

                <Spacer />
                <Title>
                    User Tracking and Advertising
                </Title>
                <Paragraph>
                    DoomDoomTech provides transparency regarding user tracking practices and allows users to opt-out of tracking for advertising purposes.
                </Paragraph>

                <Spacer />
                <Title>
                    Automated Decision-Making and Profiling
                </Title>
                <Paragraph>
                    DoomDoomTech may use automated systems and decision-making to profile user characteristics and personalize content and advertisements. This includes analyzing information users provide, interactions with the platform, and information obtained from third parties. This data helps create user segments with similar characteristics for targeted content and advertising.
                </Paragraph>

                <Spacer />
                <Title>
                    User Rights Under GDPR
                </Title>
                <Paragraph>
                    {"DoomDoomTech recognizes the following user rights under GDPR:\n" +
                        "\t\t\t        Right to be Informed: Users have the right to be informed about the collection and use of their personal data.\n" +
                        "\t\t\t        Right of Access: Users can request access to their personal data.\n" +
                        "\t\t\t        Right to Rectification: Users can request correction of inaccurate or incomplete data.\n" +
                        "\t\t\t        Right to Erasure: Users can request deletion of their data under certain conditions.\n" +
                        "\t\t\t        Right to Restrict Processing: Users can request the restriction of processing their personal data under specific circumstances.\n" +
                        "\t\t\t        Right to Data Portability: Users can request their data in a structured, commonly used, and machine-readable format.\n" +
                        "\t\t\t        Right to Object: Users can object to the processing of their personal data for direct marketing purposes.\n" +
                        "\t\t\t        Rights Related to Automated Decision-Making and Profiling: Users have the right to not be subject to decisions based solely on automated processing, including profiling, that significantly affects them ."}
                </Paragraph>
            </ScrollView>
        </Screen>
    )
}

export default PrivacyPolicy