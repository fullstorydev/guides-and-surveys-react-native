package com.fullstory.guidesandsurveys

import android.os.Handler
import android.os.Looper
import androidx.activity.ComponentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.fullstory.surveys.sdk.Environment
import com.fullstory.surveys.sdk.SurveysSDK

/**
 * Platform-independent implementation shared by both the legacy bridge module
 * (src/legacy) and the TurboModule (src/turbo). Neither architecture-specific
 * base class is imported here.
 */
object RNGuidesAndSurveysModuleImpl {

    const val NAME = "RNGuidesAndSurveys"

    private fun onMain(block: () -> Unit) =
        Handler(Looper.getMainLooper()).post(block)

    private fun environmentFrom(string: String): Environment = when (string.lowercase()) {
        "staging"     -> Environment.STAGING
        "development" -> Environment.DEVELOPMENT
        "playpen"     -> Environment.DEVELOPMENT
        else          -> Environment.PRODUCTION
    }

    fun initialize(
        reactContext: ReactApplicationContext,
        orgId: String,
        environment: String,
        userId: String,
        promise: Promise,
    ) {
        onMain {
            try {
                SurveysSDK.initialize(
                    context      = reactContext,
                    accountToken = orgId,
                    orgId        = orgId,
                    userId       = userId,
                    environment  = environmentFrom(environment)
                )
                val activity = reactContext.currentActivity as? ComponentActivity
                if (activity != null) {
                    SurveyHostInstaller.install(activity)
                }
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("INIT_ERROR", e.message, e)
            }
        }
    }

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

    fun getAreSurveysDisabled(promise: Promise) {
        promise.resolve(SurveysSDK.areSurveysDisabled())
    }
}
