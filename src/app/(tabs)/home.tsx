import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SectionLabel } from '@/components/ui/section-label';
import { useActiveListStore } from '@/features/home/active-list-store';
import { ActiveListCard } from '@/features/home/components/active-list-card';
import { HomeEmptyState } from '@/features/home/components/home-empty-state';
import { HomeHeader } from '@/features/home/components/home-header';

export default function HomeScreen() {
  const activeList = useActiveListStore((state) => state.activeList);
  return (
    <View testID="home-screen" className="flex-1 bg-white">
      <HomeHeader />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-[22px] p-[22px] pb-[100px]"
      >
        {activeList ? (
          <View className="gap-[10px]">
            <SectionLabel>Lista atual</SectionLabel>
            <ActiveListCard
              list={activeList}
              onOpen={() => router.push('/shop')}
            />
          </View>
        ) : (
          <HomeEmptyState />
        )}
      </ScrollView>
    </View>
  );
}
