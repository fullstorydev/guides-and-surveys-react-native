package com.fullstory.guidesandsurveys.rn

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNGuidesAndSurveysModuleImpl.NAME)
class RNGuidesAndSurveysModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = RNGuidesAndSurveysModuleImpl.NAME

    @ReactMethod
    fun initialize(
        orgId: String,
        environment: String,
        config: ReadableMap?,
        promise: Promise,
    ) {
        RNGuidesAndSurveysModuleImpl.initialize(
            reactContext, orgId, environment, config, promise
        )
    }

    @ReactMethod
    fun identify(userId: String, promise: Promise) {
        RNGuidesAndSurveysModuleImpl.identify(userId, promise)
    }

    @ReactMethod
    fun anonymize(promise: Promise) {
        RNGuidesAndSurveysModuleImpl.anonymize(promise)
    }

    @ReactMethod
    fun showSurvey(surveyId: String?, promise: Promise) {
        RNGuidesAndSurveysModuleImpl.showSurvey(surveyId, promise)
    }

    @ReactMethod
    fun getAreSurveysDisabled(promise: Promise) {
        RNGuidesAndSurveysModuleImpl.getAreSurveysDisabled(promise)
    }

    @ReactMethod
    fun setSessionId(sessionId: String, promise: Promise) {
        RNGuidesAndSurveysModuleImpl.setSessionId(sessionId, promise)
    }

    @ReactMethod
    fun setCurrentScreen(screenName: String?, promise: Promise) {
        RNGuidesAndSurveysModuleImpl.setCurrentScreen(screenName, promise)
    }
}
