package com.fullstory.guidesandsurveys

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNGuidesAndSurveysModuleImpl.NAME)
class RNGuidesAndSurveysModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = RNGuidesAndSurveysModuleImpl.NAME

    @ReactMethod
    fun initialize(orgId: String, environment: String, userId: String, promise: Promise) {
        RNGuidesAndSurveysModuleImpl.initialize(reactContext, orgId, environment, userId, promise)
    }

    @ReactMethod
    fun identify(userId: String, promise: Promise) {
        RNGuidesAndSurveysModuleImpl.identify(userId, promise)
    }

    @ReactMethod
    fun showSurvey(surveyId: String?, promise: Promise) {
        RNGuidesAndSurveysModuleImpl.showSurvey(surveyId, promise)
    }

    @ReactMethod
    fun getAreSurveysDisabled(promise: Promise) {
        RNGuidesAndSurveysModuleImpl.getAreSurveysDisabled(promise)
    }
}
