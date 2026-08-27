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
import java.lang.ref.WeakReference

/**
 * Platform-independent implementation shared by both the legacy bridge module
 * (src/legacy) and the TurboModule (src/turbo). Neither architecture-specific
 * base class is imported here.
 */
object RNGuidesAndSurveysModuleImpl {

    const val NAME = "RNGuidesAndSurveys"

    // Tracks the Activity we last called SurveysSDK.attach() on, so we can detect
    // when the host Activity is recreated (rotation, process restart, backgrounding)
    // and re-attach to the new instance. Weak so we never keep a destroyed Activity alive.
    private var attachedActivity: WeakReference<ComponentActivity>? = null
    private var listenerContext: WeakReference<ReactApplicationContext>? = null

    private fun onMain(block: () -> Unit) =
        Handler(Looper.getMainLooper()).post(block)

    // currentActivity can be null at initialize() time (e.g. called before RN has an
    // Activity yet) and it changes identity on every recreation. attach() must be
    // re-issued each time the current Activity is a different instance from the one
    // we last attached to — the SDK does not do this automatically.
    private fun attachToCurrentActivity(reactContext: ReactApplicationContext) {
        val activity = reactContext.currentActivity as? ComponentActivity ?: return
        if (attachedActivity?.get() === activity) return
        SurveysSDK.attach(activity)
        attachedActivity = WeakReference(activity)
    }

    private fun ensureLifecycleListener(reactContext: ReactApplicationContext) {
        if (listenerContext?.get() === reactContext) return
        listenerContext = WeakReference(reactContext)
        reactContext.addLifecycleEventListener(object : LifecycleEventListener {
            override fun onHostResume() = attachToCurrentActivity(reactContext)
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
                ensureLifecycleListener(reactContext)
                attachToCurrentActivity(reactContext)
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
