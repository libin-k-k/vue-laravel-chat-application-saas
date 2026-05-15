import { defineComponent, ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { useForm, Link } from '@inertiajs/vue3';
import AppButton from '@/Components/UI/AppButton.vue';
import AppToggle from '@/Components/UI/AppToggle.vue';
import ProfilePhotoCropper from '@/Components/Profile/ProfilePhotoCropper.vue';
import PrivacyPrivateModal from '@/Components/Profile/PrivacyPrivateModal.vue';
import { useUsernameCheck } from '@/composables/useUsernameCheck';

export default defineComponent({
    name: 'ProfileEditPage',

    components: { AppButton, AppToggle, Link, ProfilePhotoCropper, PrivacyPrivateModal },

    props: {
        user: {
            type: Object,
            required: true,
        },
        privacy: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            default: null,
        },
    },

    setup(props) {
        const activeTab = ref('profile');
        const showPrivateModal = ref(false);
        const photoPreview = ref(props.user.profile_photo_url);
        const fileInput = ref(null);
        const cropSrc = ref(null);
        const showCropper = ref(false);
        const photoMenuOpen = ref(false);
        const photoMenuRef = ref(null);
        const avatarRef = ref(null);
        const usernameError = ref('');

        const hasPhoto = computed(() => Boolean(photoPreview.value));

        const form = useForm({
            name: props.user.name ?? '',
            username: props.user.username ?? '',
            email: props.user.email ?? '',
            mobile: props.user.mobile ?? '',
            profile_photo: null,
            remove_photo: false,
        });

        const privacyForm = useForm({
            is_private_profile: props.privacy.is_private_profile ?? false,
            show_online_status: props.privacy.show_online_status ?? true,
            show_profile_image: props.privacy.show_profile_image ?? true,
            show_email: props.privacy.show_email ?? false,
            show_mobile: props.privacy.show_mobile ?? false,
        });

        const {
            usernameStatus,
            usernameMessage,
            usernameSuggestions,
            isSubmitAllowed,
            applySuggestion,
        } = useUsernameCheck(() => form.username, {
            getOriginalUsername: () => props.user.username,
            getExceptUserId: () => props.user.id,
        });

        watch(() => props.user.profile_photo_url, (url) => {
            if (!form.profile_photo && !form.remove_photo) {
                photoPreview.value = url;
            }
        });

        const normalizeUsername = () => {
            form.username = (form.username ?? '').toLowerCase().trim();
        };

        const validateRequired = () => {
            let valid = true;
            form.clearErrors();

            if (!form.name?.trim()) {
                form.setError('name', 'Full name is required.');
                valid = false;
            }

            if (!form.username?.trim()) {
                form.setError('username', 'Username is required.');
                valid = false;
            }

            if (!form.email?.trim()) {
                form.setError('email', 'Email address is required.');
                valid = false;
            }

            return valid;
        };

        const onPhotoSelected = (event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                form.setError('profile_photo', 'Please select a valid image file.');
                return;
            }

            form.clearErrors('profile_photo');

            if (cropSrc.value) {
                URL.revokeObjectURL(cropSrc.value);
            }

            cropSrc.value = URL.createObjectURL(file);
            showCropper.value = true;
            photoMenuOpen.value = false;

            if (fileInput.value) {
                fileInput.value.value = '';
            }
        };

        const onCropConfirm = (file) => {
            form.profile_photo = file;
            form.remove_photo = false;

            if (photoPreview.value?.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview.value);
            }

            photoPreview.value = URL.createObjectURL(file);
            closeCropper();
        };

        const closeCropper = () => {
            showCropper.value = false;
            if (cropSrc.value) {
                URL.revokeObjectURL(cropSrc.value);
                cropSrc.value = null;
            }
        };

        const removePhoto = () => {
            form.profile_photo = null;
            form.remove_photo = true;
            if (photoPreview.value?.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview.value);
            }
            photoPreview.value = null;
            if (fileInput.value) {
                fileInput.value.value = '';
            }
            photoMenuOpen.value = false;
        };

        const togglePhotoMenu = () => {
            photoMenuOpen.value = !photoMenuOpen.value;
        };

        const triggerUpdate = () => {
            photoMenuOpen.value = false;
            fileInput.value?.click();
        };

        const onDocumentClick = (event) => {
            if (!photoMenuOpen.value) return;

            const target = event.target;
            if (avatarRef.value?.contains(target) || photoMenuRef.value?.contains(target)) {
                return;
            }

            photoMenuOpen.value = false;
        };

        onMounted(() => {
            document.addEventListener('click', onDocumentClick);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('click', onDocumentClick);
        });

        const pickSuggestion = (suggestion) => {
            applySuggestion(suggestion, (value) => {
                form.username = value;
            });
        };

        const resetPhotoState = () => {
            form.remove_photo = false;
            form.profile_photo = null;
            if (fileInput.value) {
                fileInput.value.value = '';
            }
        };

        const onSuccess = () => {
            resetPhotoState();
        };

        const submit = () => {
            normalizeUsername();
            usernameError.value = '';

            if (!validateRequired()) {
                return;
            }

            if (!isSubmitAllowed()) {
                usernameError.value = 'Please choose an available username before saving.';
                return;
            }

            const hasPhoto = form.profile_photo instanceof File;
            const removingPhoto = form.remove_photo === true;

            // Multipart must use POST + _method=patch (PATCH + FormData drops fields on PHP)
            if (hasPhoto || removingPhoto) {
                form
                    .transform((data) => ({
                        name: data.name,
                        username: data.username,
                        email: data.email,
                        mobile: data.mobile ?? '',
                        _method: 'patch',
                        ...(removingPhoto ? { remove_photo: '1' } : {}),
                        ...(hasPhoto ? { profile_photo: data.profile_photo } : {}),
                    }))
                    .post(route('profile.update'), {
                        forceFormData: true,
                        preserveScroll: true,
                        onSuccess,
                    });

                return;
            }

            form.patch(route('profile.update'), {
                preserveScroll: true,
                onSuccess,
            });
        };

        const setPublicProfile = () => {
            privacyForm.is_private_profile = false;
        };

        const tryPrivateProfile = () => {
            if (privacyForm.is_private_profile) {
                return;
            }
            showPrivateModal.value = true;
        };

        const confirmPrivateProfile = () => {
            privacyForm.is_private_profile = true;
            showPrivateModal.value = false;
        };

        const cancelPrivateProfile = () => {
            showPrivateModal.value = false;
        };

        const savePrivacy = () => {
            privacyForm.patch(route('profile.privacy.update'), {
                preserveScroll: true,
            });
        };

        watch(() => props.status, (status) => {
            if (status === 'privacy-updated') {
                activeTab.value = 'privacy';
            }
        });

        const statusMessage = () => {
            if (props.status === 'profile-updated') {
                return 'Profile updated successfully.';
            }
            if (props.status === 'privacy-updated') {
                return 'Privacy settings saved successfully.';
            }
            return null;
        };

        return {
            activeTab,
            showPrivateModal,
            privacyForm,
            setPublicProfile,
            tryPrivateProfile,
            confirmPrivateProfile,
            cancelPrivateProfile,
            savePrivacy,
            form,
            photoPreview,
            fileInput,
            cropSrc,
            showCropper,
            photoMenuOpen,
            photoMenuRef,
            avatarRef,
            hasPhoto,
            usernameStatus,
            usernameMessage,
            usernameSuggestions,
            usernameError,
            onPhotoSelected,
            onCropConfirm,
            closeCropper,
            removePhoto,
            togglePhotoMenu,
            triggerUpdate,
            pickSuggestion,
            submit,
            statusMessage,
        };
    },
});
