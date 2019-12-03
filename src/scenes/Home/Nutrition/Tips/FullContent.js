import { View, ScrollView } from "glamorous-native"
import React from "react"

import { ModalScreen } from "components/Background"

const FullContent = ({ renderContent }) => {
  return (
    <ModalScreen grabby>
      <ScrollView>
        <View flex={1} paddingHorizontal={20}>
          {renderContent && renderContent()}
        </View>
      </ScrollView>
    </ModalScreen>
  )
}

export default FullContent
