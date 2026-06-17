import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "@tanstack/react-form";
import { loginSchema } from "@/schema/auth.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner-native";

export default function LoginScreen() {
  const router = useRouter();
  const passwordInputRef = useRef<TextInput>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleEmailSubmit = useCallback(() => {
    passwordInputRef.current?.focus();
  }, []);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { error: authError } = await authClient.signIn.email({
          email: value.email.trim().toLowerCase(),
          password: value.password,
        });

        if (authError) {
          toast.error("Email or password is incorrect.");
          return;
        }

        router.replace("/(tabs)");
      } catch {
        toast.error("Cannot reach server. Check your connection.");
      }
    },
  });

  const handleSignIn = useCallback(() => {
    form.handleSubmit();
  }, [form]);

  const getError = (err: unknown): string => {
    if (typeof err === "string") return err;
    if (err && typeof err === "object" && "message" in err)
      return String((err as { message: unknown }).message);
    return "";
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{ flex: 1, justifyContent: "center" }}
            className="px-6 py-10 gap-8"
          >
            <View className="items-center gap-2">
              <Text className="text-8xl font-bold text-primary-light dark:text-primary-dark leading-[96px]">
                学
              </Text>
              <Text className="text-2xl font-bold text-ink-light dark:text-ink-dark tracking-tight">
                JLPT Study
              </Text>
              <Text className="text-sm text-muted text-center">
                Study together, level up together
              </Text>
            </View>

            <View className="gap-3">
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = loginSchema.shape.email.safeParse(value);
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
                      <Text
                        className="text-sm px-1"
                        style={{ color: "#E53E3E" }}
                      >
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
                    const result = loginSchema.shape.password.safeParse(value);
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
                        textContentType="password"
                        autoComplete="password"
                        returnKeyType="done"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        onSubmitEditing={handleSignIn}
                      />
                      <Pressable
                        onPress={handleTogglePassword}
                        hitSlop={8}
                        className="absolute right-4 top-0 bottom-0 justify-center"
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color="#87817B"
                        />
                      </Pressable>
                    </View>
                    {field.state.meta.errors.length > 0 && (
                      <Text
                        className="text-sm px-1"
                        style={{ color: "#E53E3E" }}
                      >
                        {getError(field.state.meta.errors[0])}
                      </Text>
                    )}
                  </>
                )}
              </form.Field>

              <form.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) => (
                  <Pressable
                    onPress={handleSignIn}
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
                        Sign In
                      </Text>
                    )}
                  </Pressable>
                )}
              </form.Subscribe>

              <View className="flex-row items-center justify-center mt-3">
                <Text className="text-muted text-sm">No account yet? </Text>
                <Link href="/(auth)/sign-up" asChild>
                  <Pressable>
                    <Text className="text-primary-light dark:text-primary-dark text-sm font-semibold">
                      Sign up
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
