package com.fullstory.guidesandsurveys

import android.os.Handler
import android.os.Looper
import androidx.activity.ComponentActivity
import com.facebook.react.bridge.Arguments
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

    fun setSessionId(sessionId: String, promise: Promise) {
        onMain {
            try {
                SurveysSDK.setSessionId(sessionId)
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("SET_SESSION_ID_ERROR", e.message, e)
            }
        }
    }

    fun setCurrentScreen(screenName: String?, promise: Promise) {
        onMain {
            try {
                SurveysSDK.setCurrentScreen(screenName)
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("SET_CURRENT_SCREEN_ERROR", e.message, e)
            }
        }
    }

    fun getSurveys(promise: Promise) {
        try {
            val repo = SurveysSDK.getRepository()
            val completedIds = repo.completions.value.map { it.id }.toSet()
            val array = Arguments.createArray()
            repo.surveys.value.forEach { survey ->
                val map = Arguments.createMap()
                map.putString("id", survey.id)
                map.putString("name", survey.name)
                map.putBoolean("active", survey.active)
                map.putInt("priority", survey.objectPriority)
                map.putString("pageType", survey.pages.firstOrNull()?.type?.name ?: "UNKNOWN")
                map.putInt("questionCount", survey.pages.sumOf { it.questions.size })
                map.putBoolean("completed", survey.id in completedIds)
                array.pushMap(map)
            }
            promise.resolve(array)
        } catch (e: Exception) {
            promise.reject("GET_SURVEYS_ERROR", e.message, e)
        }
    }
}
