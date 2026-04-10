import { StyleSheet, Platform } from 'react-native';

const Colors = {
  bg: '#080c14',
  glass: 'rgba(255,255,255,0.07)',
  glassBorder: 'rgba(255,255,255,0.13)',
  blue: '#2563eb',
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
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
 
  // Status bar
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? 8 : 4,
    paddingBottom: 4,
  },
  statusTime: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : undefined,
  },
  statusBattery: {
    fontSize: 11,
  },
 
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 12,
    gap: 10,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    color: Colors.text,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '300',
    marginTop: -2,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
 
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
 
  // Upload zone
  uploadZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.uploadBorder,
    borderRadius: 14,
    backgroundColor: Colors.uploadBg,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 18,
  },
  uploadTextRow: {
    fontSize: 12,
    textAlign: 'center',
  },
  uploadHighlight: {
    color: Colors.accent,
    fontWeight: '600',
    fontSize: 12,
  },
  uploadText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  uploadSubtext: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
  },
  uploadImagedText: {
    color: Colors.green,
    fontSize: 13,
    fontWeight: '600',
  },
 
  // Field label
  fieldLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
 
  // Input row
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 14,
    gap: 10,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    minHeight: 80,
    paddingTop: 11,
  },
  inputIcon: {
    fontSize: 14,
    opacity: 0.6,
    flexShrink: 0,
    marginTop: 1,
  },
  textInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 13,
    padding: 0,
    margin: 0,
  },
  textInputMultiline: {
    minHeight: 60,
    paddingTop: 0,
  },
 
  // Chips / Category
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
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
 
  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: 18,
  },
 
  // Botão verde (Cadastrar)
  btnGreen: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: Colors.green,
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  btnGreenText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
 
  // Botão outline (Cancelar)
  btnOutline: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'transparent',
  },
  btnOutlineText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 13,
  },
});

export { styles, Colors };