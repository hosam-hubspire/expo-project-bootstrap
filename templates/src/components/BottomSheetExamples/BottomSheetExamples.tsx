import { BottomSheet, ModalBottomSheet } from "@swmansion/react-native-bottom-sheet";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { AccessibilityInfo, Pressable, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView, useKeyboardState } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsActionButton, SettingsButtonRow, SettingsPanel } from "@/components/SettingsUI";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const MODAL_SCRIM_COLOR = "rgba(0, 0, 0, 0.45)";
const INLINE_BACKDROP_COLOR = "rgba(0, 0, 0, 0.35)";
const CONTENT_BOTTOM_PADDING = 16;

export type BottomSheetExamplesLabels = {
  title: string;
  description: string;
  inlineLabel: string;
  modalLabel: string;
  inlineSheetTitle: string;
  modalSheetTitle: string;
  closeLabel: string;
  dismissBackdropLabel: string;
  noteLabel: string;
  notePlaceholder: string;
  noteHelper: string;
  inlineBody: string;
  modalBody: string;
  openedAnnouncement: string;
  closedAnnouncement: string;
};

type BottomSheetExamplesContextValue = BottomSheetExamplesLabels & {
  openInline: () => void;
  openModal: () => void;
};

const BottomSheetExamplesContext = createContext<BottomSheetExamplesContextValue | null>(null);

function useBottomSheetExamplesContext() {
  const value = useContext(BottomSheetExamplesContext);
  if (!value) {
    throw new Error("BottomSheetExamples must be used within BottomSheetExamplesRoot.");
  }
  return value;
}

function announce(message: string) {
  AccessibilityInfo.announceForAccessibility(message);
}

function SheetSurface() {
  return (
    <ThemedView
      colorToken="surface-default"
      className="absolute inset-0 rounded-t-panel border border-stroke-default"
      style={StyleSheet.absoluteFill}
    />
  );
}

type SheetChromeProps = {
  title: string;
  closeLabel: string;
  onClose: () => void;
};

function SheetChrome({ title, closeLabel, onClose }: SheetChromeProps) {
  return (
    <View className="gap-xs border-b border-stroke-default px-base pb-sm pt-sm">
      <View className="items-center pb-2xs" importantForAccessibility="no-hide-descendants">
        <View className="h-1 w-9 rounded-full bg-stroke-default" />
      </View>
      <View className="flex-row items-center gap-sm">
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          className="min-h-10 min-w-10 items-center justify-center rounded-input border border-stroke-default bg-surface-secondary px-sm active:opacity-80"
        >
          <ThemedText variant="global-body-small-bold">{closeLabel}</ThemedText>
        </Pressable>
        <ThemedText variant="global-body-small-bold" className="flex-1" accessibilityRole="header">
          {title}
        </ThemedText>
      </View>
    </View>
  );
}

type BottomSheetExamplesRootProps = BottomSheetExamplesLabels & {
  children: ReactNode;
};

/**
 * Host for Settings demos. Wrap the settings `Screen` so the inline sheet sits
 * as a flex sibling (library pattern), while `ModalBottomSheet` portals via
 * `BottomSheetProvider`. Covers scrim/backdrop, keyboard padding, and a11y.
 */
export function BottomSheetExamplesRoot({ children, ...labels }: BottomSheetExamplesRootProps) {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardState((state) => state.height);
  const [inlineIndex, setInlineIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState(0);
  const [note, setNote] = useState("");

  const sheetBottomPadding = Math.max(
    CONTENT_BOTTOM_PADDING,
    insets.bottom + CONTENT_BOTTOM_PADDING,
  );
  const keyboardAwarePadding = Math.max(
    sheetBottomPadding,
    keyboardHeight > 0 ? keyboardHeight + CONTENT_BOTTOM_PADDING : sheetBottomPadding,
  );

  const onInlineSettle = useCallback(
    (nextIndex: number) => {
      announce(nextIndex === 0 ? labels.closedAnnouncement : labels.openedAnnouncement);
    },
    [labels.closedAnnouncement, labels.openedAnnouncement],
  );

  const onModalSettle = useCallback(
    (nextIndex: number) => {
      announce(nextIndex === 0 ? labels.closedAnnouncement : labels.openedAnnouncement);
    },
    [labels.closedAnnouncement, labels.openedAnnouncement],
  );

  const openInline = useCallback(() => {
    setInlineIndex(1);
  }, []);

  const openModal = useCallback(() => {
    setModalIndex(1);
  }, []);

  const value: BottomSheetExamplesContextValue = {
    ...labels,
    openInline,
    openModal,
  };

  return (
    <BottomSheetExamplesContext.Provider value={value}>
      <View className="flex-1">
        {children}

        {inlineIndex > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={labels.dismissBackdropLabel}
            onPress={() => {
              setInlineIndex(0);
            }}
            style={[StyleSheet.absoluteFill, { backgroundColor: INLINE_BACKDROP_COLOR }]}
          />
        ) : null}

        <BottomSheet
          detents={[0, "content"]}
          index={inlineIndex}
          onIndexChange={setInlineIndex}
          onSettle={onInlineSettle}
          surface={<SheetSurface />}
        >
          <View
            accessibilityViewIsModal={inlineIndex > 0}
            importantForAccessibility={inlineIndex > 0 ? "yes" : "no-hide-descendants"}
          >
            <SheetChrome
              title={labels.inlineSheetTitle}
              closeLabel={labels.closeLabel}
              onClose={() => {
                setInlineIndex(0);
              }}
            />
            <View className="gap-sm px-base pt-sm" style={{ paddingBottom: sheetBottomPadding }}>
              <ThemedText variant="global-body-small" colorToken="text-text-secondary">
                {labels.inlineBody}
              </ThemedText>
            </View>
          </View>
        </BottomSheet>

        <ModalBottomSheet
          animateContentHeight={false}
          detents={[0, "content"]}
          index={modalIndex}
          onIndexChange={setModalIndex}
          onSettle={onModalSettle}
          scrimColor={MODAL_SCRIM_COLOR}
          scrimOpacities={[0, 1]}
          surface={<SheetSurface />}
        >
          <View
            accessibilityViewIsModal={modalIndex > 0}
            importantForAccessibility={modalIndex > 0 ? "yes" : "no-hide-descendants"}
          >
            <SheetChrome
              title={labels.modalSheetTitle}
              closeLabel={labels.closeLabel}
              onClose={() => {
                setModalIndex(0);
              }}
            />
            <KeyboardAwareScrollView
              bottomOffset={CONTENT_BOTTOM_PADDING}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="gap-sm px-base pt-sm"
              contentContainerStyle={{ paddingBottom: keyboardAwarePadding }}
            >
              <ThemedText variant="global-body-small" colorToken="text-text-secondary">
                {labels.modalBody}
              </ThemedText>
              <ThemedText variant="global-body-small-bold">{labels.noteLabel}</ThemedText>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder={labels.notePlaceholder}
                accessibilityLabel={labels.noteLabel}
                multiline
                textAlignVertical="top"
                className="min-h-28 rounded-input border border-stroke-default bg-surface-secondary px-sm py-xs text-text-text-default"
              />
              <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
                {labels.noteHelper}
              </ThemedText>
            </KeyboardAwareScrollView>
          </View>
        </ModalBottomSheet>
      </View>
    </BottomSheetExamplesContext.Provider>
  );
}

/** Settings panel buttons — must render under `BottomSheetExamplesRoot`. */
export function BottomSheetExamples() {
  const { title, description, inlineLabel, modalLabel, openInline, openModal } =
    useBottomSheetExamplesContext();

  return (
    <SettingsPanel title={title} description={description}>
      <SettingsButtonRow>
        <SettingsActionButton
          label={inlineLabel}
          onPress={openInline}
          accessibilityHint={inlineLabel}
        />
        <SettingsActionButton
          label={modalLabel}
          onPress={openModal}
          accessibilityHint={modalLabel}
        />
      </SettingsButtonRow>
    </SettingsPanel>
  );
}
