import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      testID="home-screen"
      className="flex-1 items-center justify-center gap-2 bg-background p-6"
    >
      <Text className="text-2xl font-bold text-foreground">Check.it</Text>
      <Text className="text-base text-muted-foreground">
        Configuração inicial concluída? Ou será que não? Mentira, foi sim
      </Text>
    </View>
  );
}
