import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../theme/theme';
import { AppText } from '../atoms/AppText';
import { AppButton } from '../atoms/AppButton';

interface PauseModalProps {
  visible: boolean;
  score: number;
  level: number;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  visible,
  score,
  level,
  onResume,
  onRestart,
  onHome,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, THEME.shadows.medium]}>
          <View style={styles.iconContainer}>
            <Ionicons name="pause-circle" size={48} color={THEME.colors.primary} />
          </View>

          <AppText variant="titleMedium" style={styles.title} center>
            Oyun Duraklatıldı
          </AppText>

          <View style={styles.infoRow}>
            <AppText variant="body" color={THEME.colors.textMuted}>
              Seviye {level} • Skor: {score}
            </AppText>
          </View>

          <View style={styles.actions}>
            <AppButton
              title="Devam Et"
              onPress={onResume}
              variant="primary"
              size="lg"
              icon={<Ionicons name="play" size={20} color="#FFFFFF" />}
              style={styles.actionBtn}
            />

            <AppButton
              title="Yeniden Başlat"
              onPress={onRestart}
              variant="outline"
              size="md"
              icon={<Ionicons name="reload" size={18} color={THEME.colors.primary} />}
              style={styles.actionBtn}
            />

            <AppButton
              title="Ana Menüye Dön"
              onPress={onHome}
              variant="ghost"
              size="sm"
              style={styles.actionBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    fontWeight: '800',
    color: THEME.colors.textMain,
  },
  infoRow: {
    marginTop: 6,
    marginBottom: 20,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  actionBtn: {
    width: '100%',
  },
});
