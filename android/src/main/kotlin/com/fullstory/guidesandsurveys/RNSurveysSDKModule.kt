package com.fullstory.guidesandsurveys

import android.os.Handler
import android.os.Looper
import androidx.activity.ComponentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.fullstory.surveys.sdk.Environment
import com.fullstory.surveys.sdk.SurveysSDK

class RNSurveysSDKModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "RNSurveysSDK"

    private fun environmentFrom(string: String): Environment = when (string.lowercase()) {
        "staging"     -> Environment.STAGING
        "development" -> Environment.DEVELOPMENT
        // iOS uses "playpen" for the dev environment
        "playpen"     -> Environment.DEVELOPMENT
        else          -> Environment.PRODUCTION
    }

    private fun onMain(block: () -> Unit) =
        Handler(Looper.getMainLooper()).post(block)

    // MARK: - Initialize

    @ReactMethod
    fun initialize(orgId: String, environment: String, userId: String, promise: Promise) {
        onMain {
            try {
                SurveysSDK.initialize(
                    context   = reactContext,
                    accountToken = orgId,
                    orgId     = orgId,
                    userId    = userId,
                    environment = environmentFrom(environment)
                )
                val activity = reactApplicationContext.currentActivity as? ComponentActivity
                if (activity != null) {
                    SurveyHostInstaller.install(activity)
                }
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("INIT_ERROR", e.message, e)
            }
        }
    }

    // MARK: - Identity

    @ReactMethod
    fun identify(userId: String, promise: Promise) {
        onMain {
            try {
                SurveysSDK.identify(userId)
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("IDENTIFY_ERROR", e.message, e)
            }
        }
    }

    // MARK: - Survey Control

    @ReactMethod
    fun showSurvey(surveyId: String?, promise: Promise) {
        onMain {
            try {
                SurveysSDK.showSurvey(surveyId)
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("SHOW_SURVEY_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun reenableSurveys(promise: Promise) {
        onMain {
            try {
                SurveysSDK.reenableSurveys()
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("REENABLE_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun getAreSurveysDisabled(promise: Promise) {
        promise.resolve(SurveysSDK.areSurveysDisabled())
    }
}
