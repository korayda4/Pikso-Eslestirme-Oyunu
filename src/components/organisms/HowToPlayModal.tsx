import React from 'react';
import { View, StyleSheet, Modal, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../theme/theme';
import { AppText } from '../atoms/AppText';
import { AppButton } from '../atoms/AppButton';

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  visible,
  onClose,
}) => {
  const steps = [
    {
      icon: 'shapes-outline' as const,
      color: THEME.colors.primary,
      bg: THEME.colors.primaryLight,
      title: '1. Şekil ve Renk Eşleme',
      desc: 'Soru kartında belirtilen renk ve şekil kombinasyonunu seçenekler arasından bulup dokun.',
    },
    {
      icon: 'bulb-outline' as const,
      color: THEME.colors.yellow,
      bg: THEME.colors.yellowLight,
      title: '2. Çağrışım ve İpuçları',
      desc: '"Yazın serinleten tatlı lezzet" gibi ipuçlarını oku ve uyuşan nesneyi (örneğin dondurmayı) seç!',
    },
    {
      icon: 'flame-outline' as const,
      color: THEME.colors.secondary,
      bg: THEME.colors.secondaryLight,
      title: '3. Seri & Kombo Çarpanı',
      desc: 'Arka arkaya doğru bildikçe kombo çarpanın 2.5x katına kadar çıkar ve her 5 seride +1 can kazanırsın.',
    },
    {
      icon: 'timer-outline' as const,
      color: THEME.colors.mint,
      bg: THEME.colors.mintLight,
      title: '4. Süre & Can Yönetimi',
      desc: 'Her soru için verilen süre dolmadan cevap ver. Yanlış cevaplar ve süre bitimi 1 can götürür.',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.sheet, THEME.shadows.medium]}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="help-circle-outline" size={24} color={THEME.colors.primary} />
              <AppText variant="titleMedium" style={styles.headerTitle}>
                Nasıl Oynanır?
              </AppText>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={THEME.colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {steps.map((s, idx) => (
              <View key={idx} style={styles.stepItem}>
                <View style={[styles.stepIcon, { backgroundColor: s.bg }]}>
                  <Ionicons name={s.icon} size={24} color={s.color} />
                </View>
                <View style={styles.stepContent}>
                  <AppText variant="bodyLarge" style={styles.stepTitle}>
                    {s.title}
                  </AppText>
                  <AppText variant="body" color={THEME.colors.textMuted} style={styles.stepDesc}>
                    {s.desc}
                  </AppText>
                </View>
              </View>
            ))}
          </ScrollView>

          <AppButton
            title="Anladım, Haydi Oynayalım!"
            onPress={onClose}
            variant="primary"
            size="lg"
            style={styles.doneBtn}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: THEME.colors.textMain,
    fontWeight: '800',
  },
  closeButton: {
    padding: 6,
  },
  scroll: {
    marginTop: 14,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: '700',
    color: THEME.colors.textMain,
    marginBottom: 2,
  },
  stepDesc: {
    lineHeight: 20,
  },
  doneBtn: {
    marginTop: 14,
  },
});
