package com.pilotwatcher.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onResume() {
        super.onResume();
        setTheme(R.style.AppTheme_NoActionBar);
    }
}
