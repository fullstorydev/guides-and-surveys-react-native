package com.fullstory.guidesandsurveys

import android.view.ViewGroup
import androidx.activity.ComponentActivity
import androidx.compose.ui.platform.ComposeView
import com.fullstory.surveys.sdk.SurveyHost

/**
 * Attaches a transparent ComposeView containing SurveyHost() to the activity's
 * decor view so the SDK can present surveys as Compose dialogs on top of any RN UI.
 *
 * All Compose/survey UI stays inside the surveys-sdk — this file is the only
 * place in the bridge that references Compose.
 */
object SurveyHostInstaller {
    private var installed = false

    fun install(activity: ComponentActivity) {
        if (installed) return
        val composeView = ComposeView(activity).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setContent { SurveyHost() }
        }
        (activity.window.decorView as ViewGroup).addView(composeView)
        installed = true
    }
}
