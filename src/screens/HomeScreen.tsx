import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme/theme';
import { AppText } from '../components/atoms/AppText';
import { AppButton } from '../components/atoms/AppButton';
import { Badge } from '../components/atoms/Badge';
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

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Badges */}
        <View style={styles.topStatusRow}>
          <Badge
            label="⚡ %100 Çevrimdışı"
            color={THEME.colors.mint}
            backgroundColor={THEME.colors.mintLight}
            size="sm"
          />

          <Badge
            label="📸 Kamera Dedektifi"
            color={THEME.colors.primary}
            backgroundColor={THEME.colors.primaryLight}
            size="sm"
          />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={[styles.mascotCircle, THEME.shadows.medium]}>
            <Ionicons name="camera" size={54} color={THEME.colors.primary} />
            <View style={styles.floatingLens}>
              <Ionicons name="sparkles" size={20} color={THEME.colors.yellow} />
            </View>
            <View style={styles.floatingEmoji}>
              <AppText style={styles.miniEmoji}>😜</AppText>
            </View>
          </View>

          <AppText variant="titleLarge" style={styles.appTitle} center>
            Pikso
          </AppText>
          <AppText variant="bodyLarge" color={THEME.colors.primary} style={styles.appSubtitle} center>
            Kamera ile Bul & Poz Ver!
          </AppText>
          <AppText variant="caption" color={THEME.colors.textMuted} style={styles.appDesc} center>
            İstenen nesneyi, rengi veya komik yüz ifadesini kamerayla çek! Benzerlik oranına göre puanları topla!
          </AppText>
        </View>

        {/* High Score Card */}
        <View style={[styles.highScoreCard, THEME.shadows.soft]}>
          <View style={styles.scoreIconBox}>
            <Ionicons name="trophy" size={28} color={THEME.colors.yellow} />
          </View>
          <View style={styles.scoreTextBox}>
            <AppText variant="caption" color={THEME.colors.textMuted}>
              EN YÜKSEK SKORUN
            </AppText>
            <AppText variant="titleMedium" style={styles.highScoreNumber}>
              {currentHighScore.toLocaleString()} Puan
            </AppText>
          </View>
        </View>

        {/* Features Pills */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <AppText style={styles.featureEmoji}>🔴</AppText>
            <AppText variant="caption" style={styles.featureText}>Renk Avı</AppText>
          </View>
          <View style={styles.featureItem}>
            <AppText style={styles.featureEmoji}>😜</AppText>
            <AppText variant="caption" style={styles.featureText}>Komik Poz</AppText>
          </View>
          <View style={styles.featureItem}>
            <AppText style={styles.featureEmoji}>☕</AppText>
            <AppText variant="caption" style={styles.featureText}>Eşya Bul</AppText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <AppButton
            title="Macerayı Başlat"
            onPress={onStartGame}
            variant="primary"
            size="lg"
            icon={<Ionicons name="camera-outline" size={24} color="#FFFFFF" />}
            style={styles.mainPlayBtn}
          />

          <View style={styles.secondaryBtnRow}>
            <AppButton
              title="Nasıl Oynanır?"
              onPress={() => setShowHowToPlay(true)}
              variant="outline"
              size="md"
              icon={<Ionicons name="help-circle-outline" size={20} color={THEME.colors.primary} />}
              style={styles.halfBtn}
            />

            <AppButton
              title="Ayarlar"
              onPress={() => setShowSettings(true)}
              variant="outline"
              size="md"
              icon={<Ionicons name="settings-outline" size={20} color={THEME.colors.primary} />}
              style={styles.halfBtn}
            />
          </View>
        </View>
      </ScrollView>

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
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  mascotCircle: {
    width: 120,
    height: 120,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 4,
    borderColor: THEME.colors.primaryLight,
    position: 'relative',
  },
  floatingLens: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.full,
    padding: 6,
    ...THEME.shadows.soft,
  },
  floatingEmoji: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.full,
    padding: 4,
    ...THEME.shadows.soft,
  },
  miniEmoji: {
    fontSize: 20,
  },
  appTitle: {
    color: THEME.colors.textMain,
    fontWeight: '900',
    fontSize: 38,
    letterSpacing: -1,
  },
  appSubtitle: {
    fontWeight: '800',
    marginTop: 2,
    fontSize: 18,
  },
  appDesc: {
    maxWidth: 300,
    marginTop: 8,
    lineHeight: 18,
  },
  highScoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
  },
  scoreIconBox: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.yellowLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  scoreTextBox: {
    flex: 1,
  },
  highScoreNumber: {
    color: THEME.colors.textMain,
    fontWeight: '900',
    marginTop: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 8,
  },
  featureItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.md,
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  featureEmoji: {
    fontSize: 18,
  },
  featureText: {
    fontWeight: '700',
    color: THEME.colors.textMain,
  },
  actionSection: {
    gap: 12,
    marginTop: 10,
    marginBottom: 8,
  },
  mainPlayBtn: {
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
