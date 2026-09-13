import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../theme/theme';
import { AppText } from '../atoms/AppText';
import { AppButton } from '../atoms/AppButton';
import { SettingToggleRow } from '../molecules/SettingToggleRow';
import { useSettings } from '../../context/SettingsContext';
import { GameDifficulty } from '../../core/types/game';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    settings,
    updateAudio,
    setDifficulty,
    resetScores,
    toggleVibration,
  } = useSettings();

  const difficulties: { key: GameDifficulty; label: string; desc: string }[] = [
    { key: 'easy', label: 'Kolay', desc: 'Daha az seçenek, uzun süre' },
    { key: 'medium', label: 'Orta', desc: 'Standart oyun temposu' },
    { key: 'hard', label: 'Zor', desc: '6 seçenek, hızlı karar' },
  ];

  const handleResetScores = () => {
    Alert.alert(
      'Skorları Sıfırla',
      'Kayıtlı tüm en yüksek skorları sıfırlamak istediğinize emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: () => resetScores(),
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.sheet, THEME.shadows.medium]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="settings-sharp" size={24} color={THEME.colors.primary} />
              <AppText variant="titleMedium" style={styles.headerTitle}>
                Ayarlar
              </AppText>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={THEME.colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Audio Section */}
            <AppText variant="caption" color={THEME.colors.textMuted} style={styles.sectionHeader}>
              SES & MÜZİK
            </AppText>

            <SettingToggleRow
              iconName="musical-notes"
              iconColor={THEME.colors.primary}
              iconBg={THEME.colors.primaryLight}
              title="Fon Müziği"
              description="Tatlı arka plan melodisi"
              value={settings.audio.musicEnabled}
              onValueChange={(val) => updateAudio({ musicEnabled: val })}
            />

            <SettingToggleRow
              iconName="volume-high"
              iconColor={THEME.colors.mint}
              iconBg={THEME.colors.mintLight}
              title="Ses Efektleri"
              description="Doğru/yanlış ve buton sesleri"
              value={settings.audio.sfxEnabled}
              onValueChange={(val) => updateAudio({ sfxEnabled: val })}
            />

            <SettingToggleRow
              iconName="phone-portrait-outline"
              iconColor={THEME.colors.secondary}
              iconBg={THEME.colors.secondaryLight}
              title="Titreşim (Haptik)"
              description="Dokunma geri bildirimi"
              value={settings.vibrationEnabled}
              onValueChange={toggleVibration}
            />

            {/* Difficulty Section */}
            <AppText variant="caption" color={THEME.colors.textMuted} style={styles.sectionHeader}>
              BAŞLANGIÇ ZORLUĞU
            </AppText>

            <View style={styles.difficultyContainer}>
              {difficulties.map((d) => {
                const isSelected = settings.difficulty === d.key;
                return (
                  <Pressable
                    key={d.key}
                    onPress={() => setDifficulty(d.key)}
                    style={[
                      styles.diffCard,
                      isSelected && styles.diffCardSelected,
                    ]}
                  >
                    <View style={styles.diffHeader}>
                      <AppText
                        variant="bodyLarge"
                        style={[
                          styles.diffLabel,
                          isSelected && { color: THEME.colors.primary },
                        ]}
                      >
                        {d.label}
                      </AppText>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={THEME.colors.primary}
                        />
                      )}
                    </View>
                    <AppText variant="caption" color={THEME.colors.textMuted}>
                      {d.desc}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            {/* High Scores Summary */}
            <AppText variant="caption" color={THEME.colors.textMuted} style={styles.sectionHeader}>
              EN YÜKSEK SKORLAR (ÇEVRİMDIŞI)
            </AppText>

            <View style={styles.scoresRow}>
              <View style={styles.scorePill}>
                <AppText variant="caption" color={THEME.colors.textMuted}>
                  Kolay
                </AppText>
                <AppText variant="bodyLarge" style={styles.scoreVal}>
                  {settings.highScores.easy || 0}
                </AppText>
              </View>

              <View style={styles.scorePill}>
                <AppText variant="caption" color={THEME.colors.textMuted}>
                  Orta
                </AppText>
                <AppText variant="bodyLarge" style={styles.scoreVal}>
                  {settings.highScores.medium || 0}
                </AppText>
              </View>

              <View style={styles.scorePill}>
                <AppText variant="caption" color={THEME.colors.textMuted}>
                  Zor
                </AppText>
                <AppText variant="bodyLarge" style={styles.scoreVal}>
                  {settings.highScores.hard || 0}
                </AppText>
              </View>
            </View>

            {/* Reset Button */}
            <Pressable onPress={handleResetScores} style={styles.resetButton}>
              <Ionicons name="trash-outline" size={18} color={THEME.colors.error} />
              <AppText variant="body" color={THEME.colors.error} style={{ fontWeight: '700' }}>
                Skorları Sıfırla
              </AppText>
            </Pressable>

            <View style={styles.footerSpacing} />
          </ScrollView>

          {/* Close Action */}
          <AppButton
            title="Tamam"
            onPress={onClose}
            variant="primary"
            size="md"
            style={styles.doneButton}
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
    maxHeight: '85%',
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
  sectionHeader: {
    marginTop: 18,
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  difficultyContainer: {
    gap: 8,
  },
  diffCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: THEME.radius.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  diffCardSelected: {
    borderColor: THEME.colors.primary,
    backgroundColor: THEME.colors.primaryLight,
  },
  diffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  diffLabel: {
    fontWeight: '700',
    color: THEME.colors.textMain,
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scorePill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scoreVal: {
    fontWeight: '800',
    color: THEME.colors.textMain,
    marginTop: 2,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
  },
  footerSpacing: {
    height: 16,
  },
  doneButton: {
    marginTop: 12,
  },
});
