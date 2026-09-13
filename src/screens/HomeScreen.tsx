import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme/theme';
import { AppText } from '../components/atoms/AppText';
import { AppButton } from '../components/atoms/AppButton';
import { SettingsModal } from '../components/organisms/SettingsModal';
import { HowToPlayModal } from '../components/organisms/HowToPlayModal';
import { useSettings } from '../context/SettingsContext';

interface HomeScreenProps {
  onStartGame: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame }) => {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const currentHighScore = settings.highScores[settings.difficulty] || 0;

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      {/* Top Header: Sol "Eşleştir" | Sağ "Skor" */}
      <View style={styles.topHeader}>
        <View style={styles.titleContainer}>
          <AppText variant="titleMedium" style={styles.headerTitle}>
            EŞLEŞTİR
          </AppText>
        </View>

        <View style={styles.scoreBadge}>
          <Ionicons name="trophy" size={18} color={THEME.colors.yellow} />
          <AppText variant="caption" style={styles.scoreText}>
            Skor: {currentHighScore.toLocaleString()}
          </AppText>
        </View>
      </View>

      {/* Center: Büyük Tatlı Telefon Çerçevesi (Phone Mockup) */}
      <View style={styles.centerSection}>
        <View style={[styles.phoneFrame, THEME.shadows.medium]}>
          {/* Telefonun Üst Çentiği / Kamerası */}
          <View style={styles.phoneSpeakerNotch}>
            <View style={styles.phoneCameraDot} />
            <View style={styles.phoneSpeakerBar} />
          </View>

          {/* Telefon Ekranı İçi */}
          <View style={styles.phoneInnerScreen}>
            <View style={styles.cameraIconCircle}>
              <Ionicons name="camera" size={38} color={THEME.colors.primary} />
            </View>

            <AppText variant="titleLarge" style={styles.piksoLogoText} center>
              PİKSO
            </AppText>

            <View style={styles.taglinePill}>
              <AppText variant="caption" style={styles.taglineText}>
                Fotoğrafını Çek & Eşle
              </AppText>
            </View>
          </View>

          {/* Telefonun Alt Home Çubuğu */}
          <View style={styles.phoneHomeBar} />
        </View>
      </View>

      {/* Alt Kısım: Sadece Butonlar (Sadelik Esastır) */}
      <View style={styles.bottomSection}>
        <AppButton
          title="Oyuna Başla"
          onPress={onStartGame}
          variant="primary"
          size="lg"
          icon={<Ionicons name="play" size={24} color="#FFFFFF" />}
          style={styles.mainStartBtn}
        />

        <View style={styles.secondaryBtnRow}>
          <AppButton
            title="Nasıl Oynanır?"
            onPress={() => setShowHowToPlay(true)}
            variant="outline"
            size="md"
            icon={<Ionicons name="help-circle-outline" size={18} color={THEME.colors.primary} />}
            style={styles.halfBtn}
          />

          <AppButton
            title="Ayarlar"
            onPress={() => setShowSettings(true)}
            variant="outline"
            size="md"
            icon={<Ionicons name="settings-outline" size={18} color={THEME.colors.primary} />}
            style={styles.halfBtn}
          />
        </View>
      </View>

      {/* Modals */}
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <HowToPlayModal
        visible={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.colors.textMain,
    letterSpacing: 1.5,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.full,
    gap: 6,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
    ...THEME.shadows.soft,
  },
  scoreText: {
    color: THEME.colors.textMain,
    fontWeight: '800',
    fontSize: 13,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  phoneFrame: {
    width: 230,
    height: 370,
    backgroundColor: '#FFFFFF',
    borderRadius: 44,
    borderWidth: 6,
    borderColor: THEME.colors.primary,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneSpeakerNotch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  phoneCameraDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  phoneSpeakerBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  phoneInnerScreen: {
    flex: 1,
    width: '100%',
    backgroundColor: THEME.colors.primaryLight,
    borderRadius: 28,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  cameraIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...THEME.shadows.soft,
  },
  piksoLogoText: {
    fontSize: 42,
    fontWeight: '900',
    color: THEME.colors.primary,
    letterSpacing: 2,
  },
  taglinePill: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
  },
  taglineText: {
    color: THEME.colors.textMuted,
    fontWeight: '700',
    fontSize: 11,
  },
  phoneHomeBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: 4,
  },
  bottomSection: {
    gap: 12,
    marginBottom: 6,
  },
  mainStartBtn: {
    width: '100%',
  },
  secondaryBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfBtn: {
    flex: 1,
  },
});
