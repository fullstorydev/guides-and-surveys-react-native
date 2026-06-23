package com.fullstory.guidesandsurveys

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

// TurboReactPackage is backward-compatible: on old arch it behaves like ReactPackage,
// on new arch it participates in the TurboModule eager/lazy loading system.
class RNGuidesAndSurveysPackage : TurboReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == RNGuidesAndSurveysModule.NAME) RNGuidesAndSurveysModule(reactContext) else null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                RNGuidesAndSurveysModule.NAME to ReactModuleInfo(
                    RNGuidesAndSurveysModule.NAME,
                    RNGuidesAndSurveysModule.NAME,
                    false,  // canOverrideExistingModule
                    false,  // needsEagerInit
                    true    // isTurboModule
                )
            )
        }
    }
}
