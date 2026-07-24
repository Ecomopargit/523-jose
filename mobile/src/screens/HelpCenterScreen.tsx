import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenAtmosphere } from "../components/UI";
import { colors, fonts, shadow } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "HelpCenter">;

const faqs = [
  { question: "Como funciona a contribuição diária?", answer: "A contribuição diária é de R$ 7,00. Desse valor, R$ 5,00 são destinados à sua reserva pessoal e R$ 2,00 mantêm os serviços e benefícios da associação." },
  { question: "Quando posso sacar minha reserva?", answer: "O saldo disponível pode ser solicitado conforme as condições do seu plano. Valores em carência ficam liberados após o período indicado na Carteira." },
  { question: "Como faço um depósito via PIX?", answer: "Acesse Carteira e toque em Depositar. O aplicativo apresentará o PIX e as instruções para concluir a contribuição." },
  { question: "Como funciona o bônus por indicação?", answer: "Compartilhe seu código na área Benefícios. Quando o motorista indicado concluir a ativação, o bônus será registrado na sua conta." },
  { question: "Posso alterar meu CPF ou e-mail?", answer: "Por segurança, CPF e e-mail precisam ser alterados pela equipe de suporte após a confirmação da sua identidade." },
  { question: "Meus dados estão seguros?", answer: "Sim. O acesso usa Firebase Authentication e regras que limitam cada associado aos próprios dados, conversas e arquivos." },
  { question: "Como solicitar um benefício?", answer: "Abra a área Benefícios, selecione o serviço desejado e siga as orientações. Alguns benefícios ainda estão sendo liberados gradualmente." },
];

export function HelpCenterScreen({ navigation }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <StatusBar style="dark" />
      <ScreenAtmosphere />
      <View style={styles.header}>
        <Pressable onPress={navigation.goBack} style={styles.back}><Feather color={colors.green800} name="arrow-left" size={19} /></Pressable>
        <View><Text style={styles.eyebrow}>PERGUNTAS FREQUENTES</Text><Text style={styles.title}>Central de ajuda</Text></View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}><Feather color={colors.white} name="help-circle" size={24} /></View>
          <View style={{ flex: 1 }}><Text style={styles.heroTitle}>Encontre respostas rápidas</Text><Text style={styles.heroText}>Tudo o que você precisa saber sobre sua associação.</Text></View>
        </View>

        <Text style={styles.section}>Dúvidas mais comuns</Text>
        <View style={styles.faqList}>
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <Pressable key={faq.question} onPress={() => setOpenIndex(open ? null : index)} style={[styles.faq, open && styles.faqOpen]}>
                <View style={styles.questionRow}>
                  <View style={[styles.number, open && styles.numberOpen]}><Text style={[styles.numberText, open && styles.numberTextOpen]}>{String(index + 1).padStart(2, "0")}</Text></View>
                  <Text style={styles.question}>{faq.question}</Text>
                  <Feather color={open ? colors.green700 : colors.inkFaint} name={open ? "minus" : "plus"} size={17} />
                </View>
                {open && <Text style={styles.answer}>{faq.answer}</Text>}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.contact}>
          <View style={styles.contactIcon}><Feather color={colors.white} name="message-circle" size={20} /></View>
          <View style={{ flex: 1 }}><Text style={styles.contactTitle}>Ainda precisa de ajuda?</Text><Text style={styles.contactText}>Converse diretamente com nossa equipe.</Text></View>
          <Pressable onPress={() => navigation.replace("Support")} style={styles.contactButton}><Text style={styles.contactButtonText}>Abrir chat</Text><Feather color={colors.green900} name="arrow-right" size={14} /></Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.background, flex: 1 },
  header: { alignItems: "center", flexDirection: "row", gap: 13, padding: 20 },
  back: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 12, borderWidth: 1, height: 40, justifyContent: "center", width: 40, ...shadow },
  eyebrow: { color: colors.green600, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1.3 },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: 22, letterSpacing: -0.7, marginTop: 1 },
  content: { padding: 20, paddingBottom: 40, paddingTop: 3 },
  hero: { alignItems: "center", backgroundColor: colors.green900, borderRadius: 21, flexDirection: "row", gap: 13, padding: 17, ...shadow },
  heroIcon: { alignItems: "center", backgroundColor: colors.green500, borderRadius: 15, height: 50, justifyContent: "center", width: 50 },
  heroTitle: { color: colors.white, fontFamily: fonts.bold, fontSize: 13 },
  heroText: { color: "rgba(255,255,255,0.52)", fontFamily: fonts.regular, fontSize: 9, marginTop: 3 },
  section: { color: colors.ink, fontFamily: fonts.bold, fontSize: 14.5, marginBottom: 11, marginTop: 23 },
  faqList: { gap: 9 },
  faq: { backgroundColor: colors.surface, borderColor: colors.line, borderRadius: 17, borderWidth: 1, padding: 14, ...shadow },
  faqOpen: { backgroundColor: colors.green50, borderColor: colors.green100 },
  questionRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  number: { alignItems: "center", backgroundColor: colors.background, borderRadius: 9, height: 30, justifyContent: "center", width: 30 },
  numberOpen: { backgroundColor: colors.green700 },
  numberText: { color: colors.inkFaint, fontFamily: fonts.bold, fontSize: 8 },
  numberTextOpen: { color: colors.white },
  question: { color: colors.ink, flex: 1, fontFamily: fonts.semibold, fontSize: 10.5, lineHeight: 15 },
  answer: { color: colors.inkSoft, fontFamily: fonts.regular, fontSize: 9.5, lineHeight: 15, marginLeft: 40, marginRight: 18, marginTop: 10 },
  contact: { alignItems: "center", backgroundColor: colors.green900, borderRadius: 19, flexDirection: "row", gap: 11, marginTop: 20, padding: 14, ...shadow },
  contactIcon: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.10)", borderRadius: 12, height: 41, justifyContent: "center", width: 41 },
  contactTitle: { color: colors.white, fontFamily: fonts.bold, fontSize: 10.5 },
  contactText: { color: "rgba(255,255,255,0.5)", fontFamily: fonts.regular, fontSize: 8, marginTop: 2 },
  contactButton: { alignItems: "center", backgroundColor: colors.white, borderRadius: 11, flexDirection: "row", gap: 5, paddingHorizontal: 10, paddingVertical: 9 },
  contactButtonText: { color: colors.green900, fontFamily: fonts.bold, fontSize: 8.5 },
});
