import { router, Stack } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, type ListRenderItem, Text, View } from 'react-native';
import { useActiveListStore } from '@/features/home/active-list-store';
import { ActionRow } from '@/features/shop/components/action-row';
import { AddProductInput } from '@/features/shop/components/add-product-input';
import { DeleteListButton } from '@/features/shop/components/delete-list-button';
import { EditItemSheet } from '@/features/shop/components/edit-item-sheet';
import { EmptyState } from '@/features/shop/components/empty-state';
import { ItemRow } from '@/features/shop/components/item-row';
import { MarkAllRow } from '@/features/shop/components/mark-all-row';
import { SearchField } from '@/features/shop/components/search-field';
import { ShopHeader } from '@/features/shop/components/shop-header';
import { SortSheet } from '@/features/shop/components/sort-sheet';
import { SummaryPreviewCard } from '@/features/shop/components/summary-preview-card';
import type { ListItem } from '@/features/shop/list-item';
import {
  DEFAULT_SORT,
  type SortOption,
  useVisibleItems,
} from '@/features/shop/use-visible-items';

const SCREEN_ANIMATION_DURATION = 320;

export default function ShopScreen() {
  const {
    activeList,
    addItem,
    toggleItem,
    setAllChecked,
    updateItem,
    removeItem,
    renameList,
    deleteList,
  } = useActiveListStore((state) => state);
  const [editingItem, setEditingItem] = useState<ListItem | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);
  const [sortVisible, setSortVisible] = useState(false);
  const items = activeList?.items ?? [];
  const checkedCount = useMemo(
    () => items.reduce((count, item) => (item.checked ? count + 1 : count), 0),
    [items],
  );
  const visibleItems = useVisibleItems({ items, search, sort });
  const renderItem = useCallback<ListRenderItem<ListItem>>(
    ({ item }) => (
      <ItemRow
        item={item}
        onToggle={toggleItem}
        onEdit={setEditingItem}
        onRemove={removeItem}
      />
    ),
    [toggleItem, removeItem],
  );
  const handleDelete = useCallback(() => {
    deleteList();
    router.replace('/home');
  }, [deleteList]);
  if (!activeList) return null;
  const hasItems = items.length > 0;
  return (
    <View testID="shop-screen" className="flex-1 bg-white">
      <Stack.Screen
        options={{
          animation: 'slide_from_right',
          animationDuration: SCREEN_ANIMATION_DURATION,
        }}
      />
      <View>
        <ShopHeader
          list={activeList}
          onRename={renameList}
          onClose={() => router.back()}
        />
        <View className="px-[22px] pt-4">
          <AddProductInput onAdd={addItem} />
          {hasItems && (
            <>
              <ActionRow
                sort={sort}
                onOpenSort={() => setSortVisible(true)}
              />
              <SearchField value={search} onChange={setSearch} />
            </>
          )}
        </View>
        {hasItems && (
          <MarkAllRow
            checkedCount={checkedCount}
            totalCount={items.length}
            onToggle={setAllChecked}
          />
        )}
      </View>
      <FlatList
        testID="shop-list"
        className="flex-1"
        data={visibleItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          hasItems ? (
            <View
              testID="shop-no-results"
              className="items-center px-[22px] py-12"
            >
              <Text className="text-sm text-checkit-pebble-gray">
                Nenhum produto encontrado.
              </Text>
            </View>
          ) : (
            <EmptyState />
          )
        }
        ListFooterComponent={
          hasItems ? (
            <View>
              <View className="px-[22px]">
                <SummaryPreviewCard list={activeList} />
              </View>
              <DeleteListButton
                listName={activeList.name}
                onDelete={handleDelete}
              />
            </View>
          ) : null
        }
        contentContainerClassName="pb-[100px]"
        keyboardShouldPersistTaps="handled"
      />
      <SortSheet
        visible={sortVisible}
        current={sort}
        onSelect={(next) => {
          setSort(next);
          setSortVisible(false);
        }}
        onClose={() => setSortVisible(false)}
      />
      <EditItemSheet
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={updateItem}
        onRemove={removeItem}
      />
    </View>
  );
}
