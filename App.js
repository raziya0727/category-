import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView, View, Text, ScrollView, Pressable, Image,
  useWindowDimensions, StatusBar, Platform
} from 'react-native';
import { CartProvider, useCart } from './src/context/CartContext';
import { CATEGORIES, PRODUCTS } from './src/data/catalog';
import { styles } from './src/styles';

function ProductCard({ product }) {
  const { items, toggleItem } = useCart();
  const selected = Boolean(items[product.id]);
  return (
    <View style={styles.productCard}>
      <View style={styles.productImageWrap}>
        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productMeta}>{product.unit}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${selected ? 'Remove' : 'Add'} ${product.name} ${selected ? 'from' : 'to'} cart`}
        onPress={() => toggleItem(product.id)}
        style={[styles.addButton, selected && styles.removeButton]}
      >
        <Text style={styles.addButtonText}>{selected ? '−' : '+'}</Text>
      </Pressable>
    </View>
  );
}

function ShoppingScreen() {
  const { items, totalCount, totalPrice } = useCart();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const scrollRef = useRef(null);
  const sectionY = useRef({});
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const programmaticScroll = useRef(false);

  const productsByCategory = useMemo(() => {
    return CATEGORIES.map(category => ({
      ...category,
      products: PRODUCTS.filter(product => product.categoryId === category.id),
    }));
  }, []);

  const selectCategory = useCallback((categoryId) => {
    setActiveCategory(categoryId);
    const y = sectionY.current[categoryId];
    if (typeof y === 'number' && scrollRef.current) {
      programmaticScroll.current = true;
      scrollRef.current.scrollTo({ y: Math.max(0, y - 12), animated: true });
      setTimeout(() => { programmaticScroll.current = false; }, 450);
    }
  }, []);

  const handleScroll = useCallback((event) => {
    if (programmaticScroll.current) return;
    const y = event.nativeEvent.contentOffset.y + 80;
    let current = CATEGORIES[0].id;
    for (const category of CATEGORIES) {
      const top = sectionY.current[category.id];
      if (typeof top === 'number' && top <= y) current = category.id;
    }
    setActiveCategory(current);
  }, []);

  const categoryPanel = (
    <View style={[styles.categoryPanel, isWide && styles.categoryPanelWide]}>
      <Text style={styles.panelTitle}>Categories</Text>
      {CATEGORIES.map(category => {
        const active = activeCategory === category.id;
        return (
          <Pressable key={category.id} onPress={() => selectCategory(category.id)}
            style={[styles.categoryButton, active && styles.categoryButtonActive, !isWide && styles.categoryButtonMobile]}>
            <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{category.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Daily Basket</Text>
          <Text style={styles.subtitle}>Fresh picks, delivered simply</Text>
        </View>
        <View style={styles.cartPill}>
          <Text style={styles.cartPillText}>🛒 {totalCount} items · ₹{totalPrice}</Text>
        </View>
      </View>

      <View style={[styles.main, isWide && styles.mainWide]}>
        {isWide && categoryPanel}
        <View style={styles.content}>
          {!isWide && categoryPanel}
          <ScrollView ref={scrollRef} onScroll={handleScroll} scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}>
            {productsByCategory.map(category => (
              <View key={category.id}
                onLayout={event => { sectionY.current[category.id] = event.nativeEvent.layout.y; }}
                style={styles.section}>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionTitle}>{category.name}</Text>
                  <Text style={styles.sectionCount}>{category.products.length} products</Text>
                </View>
                <View style={styles.productGrid}>
                  {category.products.map(product => <ProductCard key={product.id} product={product} />)}
                </View>
              </View>
            ))}
            <View style={{ height: 36 }} />
          </ScrollView>
        </View>
      </View>
      {totalCount > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.bottomBarText}>{totalCount} items in your cart</Text>
          <Text style={styles.bottomBarTotal}>Total ₹{totalPrice}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return <CartProvider><ShoppingScreen /></CartProvider>;
}
