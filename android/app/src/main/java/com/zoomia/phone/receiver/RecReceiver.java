package com.zoomia.phone.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.zoomia.phone.service.RecService;
import com.facebook.react.HeadlessJsTaskService;
import android.telephony.TelephonyManager;

public final class RecReceiver extends BroadcastReceiver {
    private static boolean ring = false;
    private static boolean callReceived = false;

    public final void onReceive(Context context, Intent intent) {
        Intent recIntent = new Intent(context, RecService.class);
        if (intent.getAction().equals("android.intent.action.PHONE_STATE")) {
            recIntent.putExtra("action", "phone_state");
            String phoneState = intent.getStringExtra("state");
            if(phoneState == null) return;
            if (phoneState.equals(TelephonyManager.EXTRA_STATE_RINGING)) {
                String phoneNumber = intent.getStringExtra("incoming_number");
                ring = true;
                recIntent.putExtra("state", "extra_state_ringing");
                recIntent.putExtra("ring", true);
                recIntent.putExtra("number", phoneNumber);
            } else if (phoneState.equals(TelephonyManager.EXTRA_STATE_OFFHOOK)) {
                callReceived = true;
				String phoneNumber = intent.getStringExtra("incoming_number");
                recIntent.putExtra("state", "extra_state_offhook");
                recIntent.putExtra("callReceived", true);
				recIntent.putExtra("number", phoneNumber);
            } else if (phoneState.equals(TelephonyManager.EXTRA_STATE_IDLE)) {
                ring = false;
                callReceived = false;
                recIntent.putExtra("state", "extra_state_idle");
            }
        } else {
            recIntent.putExtra("action", "new_outgoing_call");
        }
        context.startService(recIntent);
        HeadlessJsTaskService.acquireWakeLockNow(context);
    }
}
