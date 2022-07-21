import React from "react"
import { useParams } from "react-router-dom"
import {
  Box,
  SlideFade,
  Tabs,
  TabList,
  Tab,
  usePageContainerProvider,
} from "components"
import { Assets } from "views/home/assets"
import { TxnList } from "features/transactions"
import { MultisigSettings } from "../multisig-settings/multisig-settings"
import { useNetworkStatus } from "features/network"
import { AccountFeatureTypes, NetworkAttributes } from "many-js"
import { AccountSettings } from "../account-settings"

enum TabNames {
  assets = "assets",
  activity = "activity",
  accountSettings = "account settings",
  multisigSettings = "multisig settings",
}

export function AccountDetails() {
  const { accountAddress } = useParams()
  const { getAttribute, getFeatures } = useNetworkStatus()
  const accountAttribute = getAttribute(NetworkAttributes.account)
  const { [AccountFeatureTypes.accountMultisig]: hasMultisig } = getFeatures(
    accountAttribute,
    [AccountFeatureTypes.accountMultisig],
  )

  const [activeTabIdx, setActiveTabIdx] = React.useState(0)
  let tabs = Object.values(TabNames).slice(0, hasMultisig ? undefined : -1)
  const activeTabName = tabs[activeTabIdx]
  const [, setContainerProps] = usePageContainerProvider()

  React.useLayoutEffect(() => {
    setContainerProps({
      w: { base: "full" },
    })
  }, [setContainerProps])

  return (
    <Box pb={4} w="full">
      <Tabs mb={3} index={activeTabIdx} onChange={setActiveTabIdx}>
        <TabList>
          {tabs.map(tab => {
            return <Tab key={tab}>{tab}</Tab>
          })}
        </TabList>
      </Tabs>
      <Box position="relative">
        <SlideFade in key={activeTabName}>
          {activeTabName === TabNames.assets && (
            <Assets
              address={accountAddress as string}
              accountAddress={accountAddress}
            />
          )}
          {activeTabName === TabNames.activity && (
            <TxnList address={accountAddress as string} />
          )}

          {activeTabName === TabNames.multisigSettings && (
            <MultisigSettings accountAddress={accountAddress} />
          )}
          {activeTabName === TabNames.accountSettings && (
            <AccountSettings accountAddress={accountAddress} />
          )}
        </SlideFade>
      </Box>
    </Box>
  )
}
