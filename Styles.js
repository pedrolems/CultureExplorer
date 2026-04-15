import { StyleSheet } from 'react-native';

const Colors = {
  bg: '#080c14',
  accent: '#38bdf8',
  text: '#f0f4ff',
  textMuted: 'rgba(240,244,255,0.55)',
  green: '#10b981',
  inputBg: 'rgba(255,255,255,0.09)',
  inputBorder: 'rgba(255,255,255,0.15)',
  chipBg: 'rgba(255,255,255,0.06)',
  chipBorder: 'rgba(255,255,255,0.15)',
  chipActiveBg: 'rgba(37,99,235,0.3)',
  chipActiveBorder: 'rgba(56,189,248,0.5)',
  uploadBg: 'rgba(255,255,255,0.04)',
  uploadBorder: 'rgba(255,255,255,0.2)',
  divider: 'rgba(255,255,255,0.08)',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },

  scrollView: { flex: 1 },
  scrollContent: { padding: 18 },

  uploadZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.uploadBorder,
    borderRadius: 16,
    backgroundColor: Colors.uploadBg,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },

  uploadTextRow: { fontSize: 13 },
  uploadHighlight: { color: Colors.accent, fontWeight: '600' },
  uploadText: { color: 'rgba(255,255,255,0.4)' },
  uploadSubtext: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
  uploadImagedText: { color: Colors.green, fontWeight: '600' },

  fieldLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 6,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    gap: 10,
  },

  inputRowMultiline: {
    alignItems: 'flex-start',
    minHeight: 80,
  },

  textInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
  },

  textInputMultiline: {
    minHeight: 60,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.chipBg,
    borderWidth: 1,
    borderColor: Colors.chipBorder,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  chipActive: {
    backgroundColor: Colors.chipActiveBg,
    borderColor: Colors.chipActiveBorder,
  },

  chipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },

  chipTextActive: {
    color: Colors.accent,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: 18,
  },

  btnGreen: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    paddingVertical: 15,
    backgroundColor: Colors.green,
    marginBottom: 10,
    shadowColor: Colors.green,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  btnGreenText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.8,
  },

  btnOutline: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  btnOutlineText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
});

export { styles, Colors };