import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748B',
    fontSize: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: '#FFF7E0',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  selectedRange: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  pickerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  generationValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 16,
    height: 220,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  noDataText: {
    marginTop: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  // New styles for action buttons container
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  // PDF Download button
  pdfButton: {
    flex: 1,
    backgroundColor: '#475569', // Darker slate color
    borderRadius: 8,
    padding: 14,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Share button (original download button updated)
  shareButton: {
    flex: 1,
    backgroundColor: '#FFB800',
    borderRadius: 8,
    padding: 14,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  disabledButton: {
    backgroundColor: '#94A3B8', // Lighter color when disabled
    opacity: 0.7,
  },
  // Legacy styles kept for backward compatibility
  downloadButton: {
    backgroundColor: '#FFB800',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  errorContainer: {
    backgroundColor: '#FFEFEF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#0E7490',
    lineHeight: 20,
  },
  connectionCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionText: {
    fontSize: 12,
    color: '#B91C1C',
  },
  yearPicker: {
    marginTop: 10,
  },
});

export default styles;