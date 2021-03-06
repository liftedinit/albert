import { useForm, FormProvider } from "react-hook-form"
import { Alert, AlertIcon, AlertDescription, Button, VStack } from "components"
import {
  MultisigSettingsFields,
  useMultisigSetDefaults,
} from "features/accounts"

export function MultisigSettings({
  accountAddress,
}: {
  accountAddress: string | undefined
}) {
  const formMethods = useForm({
    defaultValues: {
      threshold: 0,
      expireInSecs: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      executeAutomatically: false,
    },
  })

  const {
    mutate: doSetMultisigDefaults,
    isLoading: isSaving,
    isSuccess,
    error,
  } = useMultisigSetDefaults(accountAddress!)

  function onSave({
    expireInSecs,
    threshold,
    executeAutomatically,
  }: {
    expireInSecs: number
    threshold: number
    executeAutomatically: boolean
  }) {
    doSetMultisigDefaults({
      expireInSecs,
      threshold,
      executeAutomatically,
    })
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSave)}>
        <VStack alignItems="flex-start" spacing={6}>
          <MultisigSettingsFields accountAddress={accountAddress!} />

          {error?.message ? (
            <Alert status="warning" variant="left-accent">
              <AlertIcon />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : null}
          {isSuccess && (
            <Alert status="success" variant="left-accent">
              <AlertIcon />
              <AlertDescription>Settings saved</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            colorScheme="brand.teal"
            isLoading={isSaving}
            loadingText="Saving"
            w={{ base: "full", md: "auto" }}
          >
            Save
          </Button>
        </VStack>
      </form>
    </FormProvider>
  )
}
