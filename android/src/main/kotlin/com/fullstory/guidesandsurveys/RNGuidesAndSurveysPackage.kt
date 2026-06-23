package com.fullstory.guidesandsurveys

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class RNGuidesAndSurveysPackage : TurboReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == RNGuidesAndSurveysModuleImpl.NAME) RNGuidesAndSurveysModule(reactContext) else null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                RNGuidesAndSurveysModuleImpl.NAME to ReactModuleInfo(
                    RNGuidesAndSurveysModuleImpl.NAME,
                    RNGuidesAndSurveysModuleImpl.NAME,
                    false,  // canOverrideExistingModule
                    false,  // needsEagerInit
                    false,  // hasConstants
                    false,  // isCxxModule
                    BuildConfig.IS_NEW_ARCHITECTURE_ENABLED  // isTurboModule
                )
            )
        }
    }
}
