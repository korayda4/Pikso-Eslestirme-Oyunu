import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
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
  const { settings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const currentHighScore = settings.highScores[settings.difficulty] || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Badges & Status */}
        <View style={styles.topStatusRow}>
          <Badge
            label="⚡ %100 Çevrimdışı"
            color={THEME.colors.mint}
            backgroundColor={THEME.colors.mintLight}
            size="sm"
          />

          <Badge
            label={`Zorluk: ${settings.difficulty === 'easy' ? 'Kolay' : settings.difficulty === 'medium' ? 'Orta' : 'Zor'}`}
            color={THEME.colors.primary}
            backgroundColor={THEME.colors.primaryLight}
            size="sm"
          />
        </View>

        {/* Mascot & Hero Visual */}
        <View style={styles.heroSection}>
          <View style={[styles.mascotCircle, THEME.shadows.medium]}>
            <Ionicons name="shapes" size={64} color={THEME.colors.primary} />
            <View style={styles.floatingStar}>
              <Ionicons name="star" size={24} color={THEME.colors.yellow} />
            </View>
            <View style={styles.floatingHeart}>
              <Ionicons name="heart" size={22} color={THEME.colors.accent} />
            </View>
          </View>

          <AppText variant="titleLarge" style={styles.appTitle} center>
            Pikso
          </AppText>
          <AppText variant="bodyLarge" color={THEME.colors.primary} style={styles.appSubtitle} center>
            Şekil, Renk & Eşleme Macerası
          </AppText>
          <AppText variant="caption" color={THEME.colors.textMuted} style={styles.appDesc} center>
            Söylenen kelime ve ipuçlarına göre doğru nesneyi veya şekli bul, serileri yakala ve puanları topla!
          </AppText>
        </View>

        {/* High Score Card */}
        <View style={[styles.highScoreCard, THEME.shadows.soft]}>
          <View style={styles.scoreIconBox}>
            <Ionicons name="trophy" size={26} color={THEME.colors.yellow} />
          </View>
          <View style={styles.scoreTextBox}>
            <AppText variant="caption" color={THEME.colors.textMuted}>
              EN YÜKSEK REKORUN
            </AppText>
            <AppText variant="titleMedium" style={styles.highScoreNumber}>
              {currentHighScore.toLocaleString()}
            </AppText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <AppButton
            title="Oyuna Başla"
            onPress={onStartGame}
            variant="primary"
            size="lg"
            icon={<Ionicons name="play" size={24} color="#FFFFFF" />}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  mascotCircle: {
    width: 130,
    height: 130,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: THEME.colors.primaryLight,
    position: 'relative',
  },
  floatingStar: {
    position: 'absolute',
    top: -4,
    right: 2,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.full,
    padding: 4,
    ...THEME.shadows.soft,
  },
  floatingHeart: {
    position: 'absolute',
    bottom: -2,
    left: 2,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.full,
    padding: 4,
    ...THEME.shadows.soft,
  },
  appTitle: {
    color: THEME.colors.textMain,
    fontWeight: '900',
    fontSize: 38,
    letterSpacing: -1,
  },
  appSubtitle: {
    fontWeight: '700',
    marginTop: 2,
  },
  appDesc: {
    maxWidth: 290,
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
    marginVertical: 16,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceBorder,
  },
  scoreIconBox: {
    width: 50,
    height: 50,
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
  actionSection: {
    gap: 12,
    marginTop: 10,
    marginBottom: 10,
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
