package com.example.moonkoi.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = MoonCyan,
    onPrimary = MidnightIndigo,
    primaryContainer = SurfaceCard,
    onPrimaryContainer = MoonCyanGlow,
    secondary = LanternAmber,
    onSecondary = MidnightIndigo,
    secondaryContainer = SurfaceVariantDark,
    onSecondaryContainer = LanternAmberGlow,
    tertiary = JadeTide,
    onTertiary = MidnightIndigo,
    background = MidnightIndigo,
    onBackground = StarlightWhite,
    surface = SurfaceDark,
    onSurface = StarlightWhite,
    surfaceVariant = SurfaceVariantDark,
    onSurfaceVariant = SlateMuted
)

@Composable
fun MoonKoiCourierTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = DarkColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = MidnightIndigo.toArgb()
                window.navigationBarColor = MidnightIndigo.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
                WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
