import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { NavigationRow } from '@/features/settings/components/navigation-row';
import { NotificationRow } from '@/features/settings/components/notification-row';
import { SettingsHeader } from '@/features/settings/components/settings-header';
import { SettingsSection } from '@/features/settings/components/settings-section';
import { VersionRow } from '@/features/settings/components/version-row';
import { SETTINGS_ABOUT_ROWS } from '@/features/settings/settings-content';

export default function SettingsScreen() {
  return (
    <View testID="settings-screen" className="flex-1 bg-white">
      <SettingsHeader />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-[22px] pb-[100px]"
      >
        <SettingsSection label="NOTIFICAÇÕES">
          <NotificationRow />
        </SettingsSection>
        <SettingsSection label="SOBRE">
          {SETTINGS_ABOUT_ROWS.map((row) =>
            row.kind === 'version' ? (
              <VersionRow key={row.id} Icon={row.Icon} label={row.label} />
            ) : (
              <NavigationRow
                key={row.id}
                Icon={row.Icon}
                label={row.label}
                onPress={() => router.push(row.route)}
                testID={`about-row-${row.id}`}
              />
            ),
          )}
        </SettingsSection>
      </ScrollView>
    </View>
  );
}
