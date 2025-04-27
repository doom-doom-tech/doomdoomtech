import React from 'react';
import PageHeader from "@/common/components/PageHeader";
import {spacing} from "@/theme";
import {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import {ScrollView} from "react-native";
import Title from "@/features/legal/components/Title";
import Paragraph from "@/features/legal/components/Paragraph";
import Screen from "@/common/components/Screen";
import Spacer from "@/features/legal/components/Spacer";

interface TermsOfServiceProps {}

const ChallengeTerms: React.FC<TermsOfServiceProps> = () => {
	const styles: Record<string, ViewStyle> = {
		content: {
			paddingHorizontal: spacing.s,
			paddingBottom: 200
		}
	}

	return (
		<Screen>
			<PageHeader title="Algemene Voorwaarden Muziekchallenge DoomDoomTech" Config={<></>} />
			<ScrollView contentContainerStyle={styles.content}>
				<Title>1. Algemene informatie</Title>
				<Paragraph>
					1.1 Deze algemene voorwaarden zijn van toepassing op de muziekchallenge georganiseerd door DoomDoomTech (hierna: de "Organisator").{'\n'}
					1.2 De challenge loopt van 15 oktober tot en met 15 november 2024.{'\n'}
					1.3 De finale vindt plaats op 29 november 2024.{'\n'}
					1.4 Door deelname aan de muziekchallenge gaat de deelnemer akkoord met deze algemene voorwaarden.
				</Paragraph>
				<Spacer />

				<Title>2. Deelnamevoorwaarden</Title>
				<Paragraph>
					2.1 De challenge staat open voor iedereen van 18 jaar of ouder.{'\n'}
					2.2 De deelnemer dient de muziek zelf te hebben gecreëerd en dient houder te zijn van de auteursrechten op de ingezonden muziek.{'\n'}
					2.3 Medewerkers van DoomDoomTech en directe familieleden zijn uitgesloten van deelname.
				</Paragraph>
				<Spacer />

				<Title>3. Uploaden van muziek</Title>
				<Paragraph>
					3.1 De deelnemer kan zijn of haar muziek uploaden via de website van DoomDoomTech.{'\n'}
					3.2 De Organisator heeft het recht om ingezonden muziek te weigeren als deze in strijd is met wettelijke bepalingen, ethische normen of de algemene voorwaarden.
				</Paragraph>
				<Spacer />

				<Title>4. Stemproces</Title>
				<Paragraph>
					4.1 De muziek wordt beoordeeld door het publiek via een stemmechanisme op de website.{'\n'}
					4.2 Het stemmen kan op eerlijke wijze plaatsvinden; het gebruik van automatische stemprogramma's of andere frauduleuze methoden is verboden.{'\n'}
					4.3 De Organisator behoudt zich het recht voor om stemmen te controleren en te diskwalificeren in het geval van fraude.
				</Paragraph>
				<Spacer />

				<Title>5. Finalisten</Title>
				<Paragraph>
					5.1 De top 20 deelnemers op de ranglijst worden uitgenodigd voor de finale, die plaatsvindt op 29 november 2024.{'\n'}
					5.2 In de finale presenteren de finalisten hun muziek live aan een vakjury.{'\n'}
					5.3 De Organisator is niet verantwoordelijk voor reis- of verblijfskosten die finalisten mogelijk maken.
				</Paragraph>
				<Spacer />

				<Title>6. Winnaar en prijzen</Title>
				<Paragraph>
					6.1 De jury selecteert de winnaar op basis van artistieke kwaliteit, originaliteit en presentatie.{'\n'}
					6.2 De beslissing van de jury is definitief en kan niet worden aangevochten.{'\n'}
					6.3 De prijs wordt gespecificeerd op de website en kan niet worden ingewisseld voor contanten of andere goederen.
				</Paragraph>
				<Spacer />

				<Title>7. Aansprakelijkheid</Title>
				<Paragraph>
					7.1 De Organisator is niet aansprakelijk voor enige schade, verlies of kosten voortvloeiend uit deelname aan de challenge.{'\n'}
					7.2 De deelnemer vrijwaart de Organisator tegen claims van derden met betrekking tot de ingestuurde muziek, waaronder claims op basis van auteursrechtinbreuken.
				</Paragraph>
				<Spacer />

				<Title>8. Privacy</Title>
				<Paragraph>
					8.1 Door deelname aan de challenge stemt de deelnemer in met de verwerking van persoonlijke gegevens volgens het privacybeleid van DoomDoomTech.{'\n'}
					8.2 Persoonlijke gegevens worden uitsluitend gebruikt voor doeleinden die verband houden met de organisatie van de challenge.
				</Paragraph>
				<Spacer />

				<Title>9. Wijziging en beëindiging van de challenge</Title>
				<Paragraph>
					9.1 De Organisator behoudt zich het recht voor om de voorwaarden van de challenge op elk moment te wijzigen of de challenge voortijdig te beëindigen, zonder dat hiervoor enige compensatie verschuldigd is.{'\n'}
					9.2 De deelnemer wordt zo spoedig mogelijk geïnformeerd over wijzigingen in de voorwaarden.
				</Paragraph>
				<Spacer />

				<Title>10. Toepasselijk recht</Title>
				<Paragraph>
					10.1 Op deze algemene voorwaarden is het Nederlands recht van toepassing.{'\n'}
					10.2 Geschillen voortvloeiend uit de muziekchallenge zullen worden voorgelegd aan de bevoegde rechter in Nederland.
				</Paragraph>
				<Spacer />
			</ScrollView>
		</Screen>
	);
}

export default ChallengeTerms;