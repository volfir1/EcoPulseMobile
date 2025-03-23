import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('screen');

// App-wide color palette
export const colors = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#C8E6C9',
  secondary: '#FF9800',
  secondaryDark: '#F57C00',
  accent: '#03A9F4',
  accentDark: '#0288D1',
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    light: '#94A3B8',
    white: '#FFFFFF'
  },
  background: {
    main: '#F5F7FA',
    card: '#FFFFFF',
    dark: '#1E293B'
  },
  status: {
    success: '#16A34A',
    warning: '#FFB800',
    error: '#F44336',
    info: '#2E90E5'
  },
  energy: {
    solar: '#FF9800',
    wind: '#64748B',
    hydro: '#2196F3',
    geo: '#F44336',
    biomass: '#4CAF50'
  },
  ui: {
    divider: '#E0E0E0',
    iconBg: '#F8F9FB',
    shadow: '#000000'
  }
};

// Global spacing/sizing constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

// Global shadow styles
export const shadowStyles = {
  small: Platform.select({
    ios: {
      shadowColor: colors.ui.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: colors.ui.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    android: {
      elevation: 4,
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: colors.ui.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
  }),
};

// Home screen styles
export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  headerContainer: {
    width: '100%',
    ...shadowStyles.medium,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.md,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  
  // Welcome Section
  welcomeSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 4,
  },
  
  // Section styling
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  
  // Energy Modules List
  modulesListContainer: {
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  moduleCard: {
    width: width * 0.8,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: spacing.md,
    ...shadowStyles.medium,
    backgroundColor: colors.background.card,
  },
  moduleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  moduleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingTop: 30,
    height: '60%',
  },
  moduleIconContainer: {
    position: 'absolute',
    top: -15,
    left: spacing.md,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 2,
  },
  moduleDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  moduleStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  moduleStatsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.white,
    marginRight: 5,
  },
  moduleStatsLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  
  // Quick Access Section
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  quickAccessItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAccessIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickAccessText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
  },
  
  // Summary Section
  summarySection: {
    backgroundColor: colors.background.card,
    paddingVertical: 15,
    paddingHorizontal: spacing.md,
    marginBottom: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: colors.ui.iconBg,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.ui.divider,
    marginVertical: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  summaryUnit: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
});

// Dashboard screen styles
export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  contentContainer: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  yearDisplay: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  yearScrollView: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  yearButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    marginRight: spacing.xs,
  },
  yearButtonActive: {
    backgroundColor: colors.text.primary,
  },
  yearButtonInactive: {
    backgroundColor: colors.ui.iconBg,
  },
  yearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  yearButtonTextActive: {
    color: colors.text.white,
  },
  yearButtonTextInactive: {
    color: colors.text.primary,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: colors.text.white,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  
  // Summary Cards
  cardsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: 12,
    padding: spacing.md,
    ...shadowStyles.medium,
    backgroundColor: colors.background.card,
  },
  gradientCard: {
    marginHorizontal: spacing.xs,
    borderRadius: 12,
    padding: spacing.md,
    ...shadowStyles.medium,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  cardTitleLight: {
    color: 'rgba(255,255,255,0.8)',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  cardValueLight: {
    color: colors.text.white,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  cardSubtitleLight: {
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Energy Distribution
  distributionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distributionLeft: {
    flex: 1,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  distributionIcon: {
    marginRight: spacing.xs,
  },
  distributionLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  distributionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  distributionSimulated: {
    fontSize: 12,
    color: colors.status.warning,
    marginLeft: spacing.xs,
  },
  pieContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Top Performers
  performerContainer: {
    flex: 1,
    paddingLeft: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.success,
  },
  performerItem: {
    marginBottom: spacing.md,
  },
  performerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  performerName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  performerValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ui.divider,
  },
  progressIndicator: {
    height: '100%',
    borderRadius: 3,
  },
  
  // Chart section
  chartSection: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadowStyles.medium,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chartContainer: {
    height: 250,
    marginBottom: spacing.md,
  },
  
  // Energy Source Cards
  sourceCardsContainer: {
    marginBottom: spacing.lg,
  },
  sourceCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sourceCard: {
    width: '48%',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background.card,
    ...shadowStyles.small,
    borderLeftWidth: 4,
  },
  sourceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sourceCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  sourceCardSimTag: {
    fontSize: 10,
    color: colors.status.warning,
    marginLeft: spacing.xs,
  },
  sourceCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  sourceCardSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  miniChartContainer: {
    height: 80,
  },
  
  // Alert box styles
  alertContainer: {
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.warning,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E', // Amber-800
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#B45309', // Amber-700
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.text.secondary,
  },
});

// News component styles
export const newsStyles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  filtersScrollView: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  filterButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    marginRight: spacing.xs,
  },
  filterButtonActive: {
    backgroundColor: colors.text.primary,
  },
  filterButtonInactive: {
    backgroundColor: colors.ui.iconBg,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.text.white,
  },
  filterButtonTextInactive: {
    color: colors.text.primary,
  },
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdatedText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  refreshButton: {
    padding: spacing.xs,
  },
  
  // Article cards
  articlesList: {
    paddingHorizontal: spacing.md,
  },
  articleCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadowStyles.small,
  },
  articleImage: {
    width: '100%',
    height: 160,
  },
  categoryTag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  categoryTagText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '500',
  },
  articleContent: {
    padding: spacing.md,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  articleMetaText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  articleMetaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.secondary,
    marginHorizontal: spacing.xs,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  articleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  articleSource: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.accent,
  },
  
  // Article modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.divider,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalScrollView: {
    padding: spacing.md,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  modalArticleMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalMetaBadge: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: 20,
    marginLeft: spacing.sm,
  },
  modalMetaBadgeText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: '500',
  },
  modalArticleText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  modalArticleNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.text.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.ui.divider,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.ui.divider,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  readFullButton: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  readFullButtonText: {
    color: colors.text.white,
    fontWeight: '500',
    marginRight: spacing.xs,
  },
  
  // No Articles
  noArticlesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  noArticlesText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  // Loading skeleton
  loadingSkeleton: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  loadingImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.ui.divider,
  },
  loadingContent: {
    padding: spacing.md,
  },
  loadingText: {
    height: 12,
    backgroundColor: colors.ui.divider,
    borderRadius: 6,
    marginBottom: spacing.sm,
  },
  loadingTitle: {
    height: 16,
    backgroundColor: colors.ui.divider,
    borderRadius: 8,
    marginBottom: spacing.sm,
    width: '80%',
  },
  
  // Load more button
  loadMoreContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: colors.background.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    ...shadowStyles.small,
  },
  loadMoreText: {
    fontSize: 14,   
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
});