package com.fullstory.guidesandsurveys.rn

import android.os.Handler
import android.os.Looper
import androidx.activity.ComponentActivity
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.fullstory.guidesandsurveys.Environment
import com.fullstory.guidesandsurveys.SurveysConfig
import com.fullstory.guidesandsurveys.SurveysSDK

/**
 * Platform-independent implementation shared by both the legacy bridge module
 * (src/legacy) and the TurboModule (src/turbo). Neither architecture-specific
 * base class is imported here.
 */
object RNGuidesAndSurveysModuleImpl {

    const val NAME = "RNGuidesAndSurveys"

    private fun onMain(block: () -> Unit) =
        Handler(Looper.getMainLooper()).post(block)

    // reactContext.currentActivity is only set once Activity.onResume() runs, but JS
    // execution (and this initialize() call) can start as early as Activity.onCreate() —
    // so the Activity may not exist here yet. If it doesn't, wait for the first host
    // resume and attach then. The listener removes itself right after: this only closes
    // the startup-ordering gap, it does not re-attach on any later resume.
    private fun attachWhenActivityAvailable(reactContext: ReactApplicationContext) {
        val activity = reactContext.currentActivity as? ComponentActivity
        if (activity != null) {
            SurveysSDK.attach(activity)
            return
        }

        reactContext.addLifecycleEventListener(object : LifecycleEventListener {
            override fun onHostResume() {
                reactContext.removeLifecycleEventListener(this)
                (reactContext.currentActivity as? ComponentActivity)?.let { SurveysSDK.attach(it) }
            }
            override fun onHostPause() {}
            override fun onHostDestroy() {}
        })
    }

    private fun environmentFrom(string: String): Environment = when (string.lowercase()) {
        "staging" -> Environment.STAGING
        "playpen" -> Environment.PLAYPEN
        else      -> Environment.PRODUCTION
    }

    private fun surveysConfigFrom(map: ReadableMap?): SurveysConfig {
        if (map == null || !map.hasKey("language") || map.isNull("language")) {
            return SurveysConfig()
        }
        val language = map.getString("language") ?: return SurveysConfig()
        return SurveysConfig(language = language)
    }

    fun initialize(
        reactContext: ReactApplicationContext,
        orgId: String,
        environment: String,
        config: ReadableMap?,
        promise: Promise,
    ) {
        onMain {
            try {
                SurveysSDK.initialize(
                    context = reactContext,
                    orgId = orgId,
                    environment = environmentFrom(environment),
                    config = surveysConfigFrom(config),
                )
                attachWhenActivityAvailable(reactContext)
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

    fun anonymize(promise: Promise) {
        onMain {
            try {
                SurveysSDK.anonymize()
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("ANONYMIZE_ERROR", e.message, e)
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
}
