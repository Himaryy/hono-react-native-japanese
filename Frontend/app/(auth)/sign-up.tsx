import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "@tanstack/react-form";
import { signUpSchema } from "@/schema/auth.schema";
import { authClient } from "@/lib/auth-client";

export default function SignUpScreen() {
  const router = useRouter();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleToggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const showToast = useCallback((msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  }, []);

  const handleNameSubmit = useCallback(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleEmailSubmit = useCallback(() => {
    passwordInputRef.current?.focus();
  }, []);

  const handlePasswordSubmit = useCallback(() => {
    confirmPasswordInputRef.current?.focus();
  }, []);

  const getError = (err: unknown): string => {
    if (typeof err === "string") return err;
    if (err && typeof err === "object" && "message" in err)
      return String((err as { message: unknown }).message);
    return "";
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError("");
      const { error: authError } = await authClient.signUp.email({
        name: value.name.trim(),
        email: value.email.trim().toLowerCase(),
        password: value.password,
      });

      if (authError) {
        const msg = authError.message ?? "Sign up failed. Please try again.";
        setServerError(msg);
        showToast(msg);
        return;
      }

      router.replace("/(tabs)");
    },
  });

  const handleSignUp = useCallback(() => {
    form.handleSubmit();
  }, [form]);

  return (
    <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center justify-center gap-2 px-6 pt-16 pb-8">
            <Text className="text-8xl font-bold text-primary-light dark:text-primary-dark leading-[96px]">
              学
            </Text>
            <Text className="text-2xl font-bold text-ink-light dark:text-ink-dark tracking-tight">
              Create account
            </Text>
            <Text className="text-sm text-muted text-center">
              Join your friends and start studying
            </Text>
          </View>

          <View className="px-6 pb-8 gap-3">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  const result = signUpSchema.shape.name.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <>
                  <TextInput
                    className="h-14 px-4 rounded-2xl bg-surface-light dark:bg-surface-dark
                               text-ink-light dark:text-ink-dark text-base border-2 border-transparent
                               focus:border-primary-light dark:focus:border-primary-dark"
                    placeholder="Name"
                    placeholderTextColor="#87817B"
                    textContentType="name"
                    autoComplete="name"
                    returnKeyType="next"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    onSubmitEditing={handleNameSubmit}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm px-1" style={{ color: "#E53E3E" }}>
                      {getError(field.state.meta.errors[0])}
                    </Text>
                  )}
                </>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const result = signUpSchema.shape.email.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <>
                  <TextInput
                    ref={emailInputRef}
                    className="h-14 px-4 rounded-2xl bg-surface-light dark:bg-surface-dark
                               text-ink-light dark:text-ink-dark text-base border-2 border-transparent
                               focus:border-primary-light dark:focus:border-primary-dark"
                    placeholder="Email"
                    placeholderTextColor="#87817B"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoComplete="email"
                    returnKeyType="next"
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    onSubmitEditing={handleEmailSubmit}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm px-1" style={{ color: "#E53E3E" }}>
                      {getError(field.state.meta.errors[0])}
                    </Text>
                  )}
                </>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  const result = signUpSchema.shape.password.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <>
                  <View className="relative">
                    <TextInput
                      ref={passwordInputRef}
                      className="h-14 px-4 pr-14 rounded-2xl bg-surface-light dark:bg-surface-dark
                                 text-ink-light dark:text-ink-dark text-base border-2 border-transparent
                                 focus:border-primary-light dark:focus:border-primary-dark"
                      placeholder="Password"
                      placeholderTextColor="#87817B"
                      secureTextEntry={!showPassword}
                      textContentType="newPassword"
                      autoComplete="new-password"
                      returnKeyType="next"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      onSubmitEditing={handlePasswordSubmit}
                    />
                    <Pressable
                      onPress={handleTogglePassword}
                      hitSlop={8}
                      className="absolute right-4 top-0 bottom-0 justify-center"
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#87817B"
                      />
                    </Pressable>
                  </View>
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm px-1" style={{ color: "#E53E3E" }}>
                      {getError(field.state.meta.errors[0])}
                    </Text>
                  )}
                </>
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{
                onChange: ({ value, fieldApi }) => {
                  if (value !== fieldApi.form.getFieldValue("password")) {
                    return "Passwords do not match";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <>
                  <View className="relative">
                    <TextInput
                      ref={confirmPasswordInputRef}
                      className="h-14 px-4 pr-14 rounded-2xl bg-surface-light dark:bg-surface-dark
                                 text-ink-light dark:text-ink-dark text-base border-2 border-transparent
                                 focus:border-primary-light dark:focus:border-primary-dark"
                      placeholder="Confirm password"
                      placeholderTextColor="#87817B"
                      secureTextEntry={!showConfirmPassword}
                      textContentType="newPassword"
                      autoComplete="new-password"
                      returnKeyType="done"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      onSubmitEditing={handleSignUp}
                    />
                    <Pressable
                      onPress={handleToggleConfirmPassword}
                      hitSlop={8}
                      className="absolute right-4 top-0 bottom-0 justify-center"
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#87817B"
                      />
                    </Pressable>
                  </View>
                  {field.state.meta.errors.length > 0 && (
                    <Text className="text-sm px-1" style={{ color: "#E53E3E" }}>
                      {getError(field.state.meta.errors[0])}
                    </Text>
                  )}
                </>
              )}
            </form.Field>

            {serverError ? (
              <Text className="text-sm px-1" style={{ color: "#E53E3E" }}>
                {serverError}
              </Text>
            ) : null}

            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Pressable
                  onPress={handleSignUp}
                  disabled={isSubmitting}
                  className="h-14 rounded-2xl bg-primary-light dark:bg-primary-dark items-center justify-center mt-1"
                  style={({ pressed }) => ({
                    opacity: pressed || isSubmitting ? 0.75 : 1,
                  })}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white text-base font-semibold">
                      Create account
                    </Text>
                  )}
                </Pressable>
              )}
            </form.Subscribe>

            <View className="flex-row items-center justify-center mt-3">
              <Text className="text-muted text-sm">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-primary-light dark:text-primary-dark text-sm font-semibold">
                    Sign in
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
