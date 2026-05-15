/**
 * Microphone support checks and browser permission helpers.
 */

export function checkMicrophoneSupport() {
    if (typeof window === 'undefined') {
        return { supported: false, message: 'Recording is not available in this environment.' };
    }

    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
        return {
            supported: false,
            message: 'Microphone requires a secure connection (HTTPS).',
        };
    }

    if (!navigator.mediaDevices?.getUserMedia) {
        return {
            supported: false,
            message: 'Your browser does not support microphone recording.',
        };
    }

    if (typeof MediaRecorder === 'undefined') {
        return {
            supported: false,
            message: 'Your browser does not support audio recording.',
        };
    }

    return { supported: true, message: null };
}

/**
 * @returns {'granted'|'denied'|'prompt'|'unknown'}
 */
export async function queryMicrophonePermission() {
    if (!navigator.permissions?.query) {
        return 'unknown';
    }

    try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        return status.state;
    } catch {
        return 'unknown';
    }
}

/**
 * @param {DOMException|Error} err
 */
export function getMicrophoneErrorMessage(err) {
    const name = err?.name ?? '';

    switch (name) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
            return 'Microphone access was blocked. Allow the microphone in your browser site settings, then try again.';
        case 'NotFoundError':
        case 'DevicesNotFoundError':
            return 'No microphone was found on this device.';
        case 'NotReadableError':
        case 'TrackStartError':
            return 'Microphone is in use by another app. Close it and try again.';
        case 'SecurityError':
            return 'Microphone access requires HTTPS or localhost.';
        case 'AbortError':
            return 'Microphone request was cancelled.';
        default:
            return err?.message || 'Could not access the microphone.';
    }
}

/**
 * Request microphone access (shows browser permission prompt when needed).
 * Caller must stop all tracks when done: stream.getTracks().forEach(t => t.stop())
 */
export async function requestMicrophoneStream() {
    const support = checkMicrophoneSupport();
    if (!support.supported) {
        throw new Error(support.message);
    }

    try {
        return await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
            },
        });
    } catch (err) {
        throw new Error(getMicrophoneErrorMessage(err));
    }
}

/**
 * Resolve accurate duration from a recorded audio blob.
 */
export function getAudioBlobDuration(blob) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio();

        const cleanup = () => {
            audio.src = '';
            URL.revokeObjectURL(url);
        };

        audio.preload = 'metadata';
        audio.onloadedmetadata = () => {
            const duration = audio.duration;
            cleanup();
            resolve(Number.isFinite(duration) && duration > 0 ? duration : 0);
        };
        audio.onerror = () => {
            cleanup();
            resolve(0);
        };
        audio.src = url;
    });
}

export function formatAudioTime(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}
