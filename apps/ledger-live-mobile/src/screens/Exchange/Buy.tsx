import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import {
  currenciesByMarketcap,
  findCryptoCurrencyByKeyword,
} from "@ledgerhq/live-common/currencies/index";
import { useRampCatalog } from "@ledgerhq/live-common/platform/providers/RampCatalogProvider/index";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/types-cryptoassets";
import { RampCatalogEntry } from "@ledgerhq/live-common/platform/providers/RampCatalogProvider/types";
import extraStatusBarPadding from "../../logic/extraStatusBarPadding";
import TrackScreen from "../../analytics/TrackScreen";
import BigSpinner from "../../icons/BigSpinner";
import { useRampCatalogCurrencies } from "./hooks";
import SelectAccountCurrency from "./SelectAccountCurrency";
import { StackNavigatorProps } from "../../components/RootNavigator/types/helpers";
import { ExchangeNavigatorParamList } from "../../components/RootNavigator/types/ExchangeNavigator";
import { ScreenName } from "../../const";

type Props = StackNavigatorProps<ExchangeNavigatorParamList, ScreenName.ExchangeBuy>;

type State = {
  sortedCurrencies: Array<TokenCurrency | CryptoCurrency>;
  isLoading: boolean;
};
// To avoid recreating a ref on each render and triggering hooks
const emptyArray: RampCatalogEntry[] = [];
export default function OnRamp({ route }: Props) {
  const [currencyState, setCurrencyState] = useState<State>({
    sortedCurrencies: [],
    isLoading: true,
  });
  const { colors } = useTheme();
  const rampCatalog = useRampCatalog();
  const allCurrencies = useRampCatalogCurrencies(rampCatalog?.value?.onRamp || emptyArray);
  const { defaultAccountId, defaultTicker, currency } = route.params || {};
  // Check currency for the DeepLinking
  const defaultCurrencyId = useMemo(() => {
    const paramsCurrencyId = route.params?.defaultCurrencyId;

    if (!paramsCurrencyId && currency) {
      return findCryptoCurrencyByKeyword(currency)?.id;
    }

    return paramsCurrencyId;
  }, [currency, route.params?.defaultCurrencyId]);
  useEffect(() => {
    const filteredCurrencies = defaultTicker
      ? allCurrencies.filter(currency => currency.ticker === defaultTicker)
      : allCurrencies;
    currenciesByMarketcap(filteredCurrencies).then(sortedCurrencies => {
      setCurrencyState({
        sortedCurrencies,
        isLoading: false,
      });
    }); // Only get on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: colors.card,
          paddingTop: extraStatusBarPadding,
        },
      ]}
    >
      <TrackScreen category="Multibuy" name="Buy" />
      {currencyState.isLoading ? (
        <View style={styles.spinner}>
          <BigSpinner size={42} />
        </View>
      ) : (
        <SelectAccountCurrency
          flow="buy"
          allCurrencies={currencyState.sortedCurrencies}
          defaultCurrencyId={defaultCurrencyId}
          defaultAccountId={defaultAccountId}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  spinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});
