import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { newsStyles, colors } from '../styles/globalStyles';
import { useRenewableNews } from '../hooks/useEnergyData';

const RenewableNewsCard = ({ navigation }) => {
  const {
    articles,
    loading,
    error,
    lastUpdated,
    activeFilter,
    setActiveFilter,
    selectedArticle,
    setSelectedArticle,
    refreshNews,
    getTimeSince,
    categoryColors
  } = useRenewableNews();
  
  const [modalVisible, setModalVisible] = useState(false);

  // List of available filters
  const filters = [
    { id: 'all', name: 'All' },
    { id: 'solar', name: 'Solar' },
    { id: 'wind', name: 'Wind' },
    { id: 'hydro', name: 'Hydro' },
    { id: 'geothermal', name: 'Geothermal' },
    { id: 'biomass', name: 'Biomass' }
  ];

  // Open article modal
  const handleArticlePress = (article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  // Close article modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedArticle(null), 300);
  };

  // Open article in browser
  const handleReadFullArticle = (url) => {
    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Cannot open URL: " + url);
        }
      });
    }
  };

  // Handle image load error
  const handleImageError = (article) => {
    return categoryColors[article.category] || categoryColors.general;
  };

  // Render article item
  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={newsStyles.articleCard}
      onPress={() => handleArticlePress(item)}
      activeOpacity={0.8}
    >
      <View>
        {item.urlToImage ? (
          <Image
            source={{ uri: item.urlToImage }}
            style={newsStyles.articleImage}
            defaultSource={require('../assets/imgs/placeholder.png')}
            onError={() => handleImageError(item)}
          />
        ) : (
          <View 
            style={[
              newsStyles.articleImage, 
              { backgroundColor: categoryColors[item.category] || categoryColors.general }
            ]}
          />
        )}
        
        <View style={newsStyles.categoryTag}>
          <Text style={newsStyles.categoryTagText}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={newsStyles.articleContent}>
        <View style={newsStyles.articleMeta}>
          <Ionicons name="time-outline" size={12} color={colors.text.secondary} />
          <Text style={newsStyles.articleMetaText}>{item.readTime} min read</Text>
          <View style={newsStyles.articleMetaDivider} />
          <Text style={newsStyles.articleMetaText}>{getTimeSince(item.publishedAt)}</Text>
        </View>
        
        <Text style={newsStyles.articleTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={newsStyles.articleDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={newsStyles.articleSource} numberOfLines={1}>
            Source: {item.source.name}
          </Text>
          <Text style={newsStyles.readMoreText}>Read more</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render filter buttons
  const renderFilterButtons = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={newsStyles.filtersScrollView}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            newsStyles.filterButton,
            activeFilter === filter.id ? newsStyles.filterButtonActive : newsStyles.filterButtonInactive
          ]}
          onPress={() => setActiveFilter(filter.id)}
        >
          <Text
            style={[
              newsStyles.filterButtonText,
              activeFilter === filter.id ? newsStyles.filterButtonTextActive : newsStyles.filterButtonTextInactive
            ]}
          >
            {filter.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Loading skeleton placeholder
  const renderLoadingSkeleton = () => (
    <View>
      {[1, 2, 3].map((item) => (
        <View key={item} style={newsStyles.loadingSkeleton}>
          <View style={newsStyles.loadingImage} />
          <View style={newsStyles.loadingContent}>
            <View style={[newsStyles.loadingText, { width: '40%' }]} />
            <View style={newsStyles.loadingTitle} />
            <View style={newsStyles.loadingText} />
            <View style={[newsStyles.loadingText, { width: '60%' }]} />
          </View>
        </View>
      ))}
    </View>
  );

  // Render article detail modal
  const renderArticleModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={newsStyles.modalContainer}>
        {selectedArticle && (
          <View style={newsStyles.modalContent}>
            <View style={newsStyles.modalHeader}>
              <Text style={newsStyles.modalTitle} numberOfLines={1}>{selectedArticle.title}</Text>
              <TouchableOpacity style={newsStyles.closeButton} onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={newsStyles.modalScrollView}>
              {selectedArticle.urlToImage && (
                <Image 
                  source={{ uri: selectedArticle.urlToImage }} 
                  style={newsStyles.modalImage}
                  defaultSource={require('../assets/imgs/placeholder.png')}
                  onError={() => handleImageError(selectedArticle)}
                />
              )}
              
              <View style={newsStyles.modalArticleMeta}>
                <Text style={newsStyles.articleMetaText}>{selectedArticle.source.name}</Text>
                <View style={newsStyles.articleMetaDivider} />
                <Ionicons name="time-outline" size={12} color={colors.text.secondary} />
                <Text style={newsStyles.articleMetaText}>{selectedArticle.readTime} min read</Text>
                <View style={newsStyles.articleMetaDivider} />
                <Text style={newsStyles.articleMetaText}>{getTimeSince(selectedArticle.publishedAt)}</Text>
                
                <View 
                  style={[
                    newsStyles.modalMetaBadge, 
                    { backgroundColor: categoryColors[selectedArticle.category] || categoryColors.general }
                  ]}
                >
                  <Text style={newsStyles.modalMetaBadgeText}>
                    {selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1)}
                  </Text>
                </View>
              </View>
              
              <Text style={newsStyles.modalArticleText}>{selectedArticle.description}</Text>
              
              <Text style={newsStyles.modalArticleNote}>
                This is a preview. Visit the publisher's website to read the full article.
              </Text>
            </ScrollView>
            
            <View style={newsStyles.modalFooter}>
              <View style={newsStyles.buttonsRow}>
                <TouchableOpacity style={newsStyles.iconButton}>
                  <Ionicons name="bookmark-outline" size={22} color={colors.text.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={newsStyles.iconButton}>
                  <Ionicons name="share-social-outline" size={22} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={newsStyles.readFullButton}
                onPress={() => handleReadFullArticle(selectedArticle.url)}
              >
                <Text style={newsStyles.readFullButtonText}>Read Full Article</Text>
                <Ionicons name="open-outline" size={16} color={colors.text.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );

  return (
    <View style={newsStyles.container}>
      <View style={newsStyles.header}>
        <Text style={newsStyles.title}>Renewable Energy News</Text>
        
        {lastUpdated && (
          <View style={newsStyles.lastUpdated}>
            <Text style={newsStyles.lastUpdatedText}>
              Last updated: {getTimeSince(lastUpdated)}
            </Text>
            <TouchableOpacity 
              style={newsStyles.refreshButton} 
              onPress={refreshNews}
              disabled={loading}
            >
              <Ionicons 
                name="refresh" 
                size={16} 
                color={colors.text.secondary} 
                style={loading ? { transform: [{ rotate: '45deg' }] } : {}}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Filter buttons */}
      {renderFilterButtons()}
      
      {/* Error message */}
      {error && (
        <View style={{ 
          backgroundColor: 'rgba(244, 67, 54, 0.1)', 
          padding: 12, 
          borderRadius: 8, 
          marginHorizontal: 16, 
          marginBottom: 16 
        }}>
          <Text style={{ color: colors.status.error }}>{error}</Text>
        </View>
      )}
      
      {/* Loading state */}
      {loading ? (
        renderLoadingSkeleton()
      ) : articles.length === 0 ? (
        <View style={newsStyles.noArticlesContainer}>
          <Text style={newsStyles.noArticlesText}>
            No articles found for this category. Try selecting a different category or refreshing the news.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={articles.slice(0, 3)}
            renderItem={renderArticleItem}
            keyExtractor={(item) => item.id}
            style={newsStyles.articlesList}
            scrollEnabled={false}
          />
          
          {articles.length > 3 && (
            <View style={newsStyles.loadMoreContainer}>
              <TouchableOpacity 
                style={newsStyles.loadMoreButton}
                onPress={() => navigation.navigate('NewsScreen')}
              >
                <Text style={newsStyles.loadMoreText}>Load More News</Text>
                <Ionicons name="chevron-down" size={16} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      
      {/* Article Modal */}
      {renderArticleModal()}
    </View>
  );
};

export default RenewableNewsCard;