import React from "react"
import {
  AlertDialog,
  Button,
  ButtonGroup,
  FormLabel,
  FormControl,
  Input,
  Modal,
  Text,
  useToast,
  useDisclosure,
  VStack,
} from "components"
import { useContactsStore } from "features/contacts/store"
import { Contact } from "features/contacts/types"

interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement
  address: HTMLInputElement
}

export function UpdateContact({
  header,
  contact,
  children,
}: {
  header?: string
  contact?: Contact
  children: (onOpen: () => void) => void
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { byId, updateContact, deleteContact } = useContactsStore(
    ({ byId, updateContact, deleteContact }) => ({
      byId,
      updateContact,
      deleteContact,
    }),
  )

  function onSubmit(c: Contact) {
    if (contact) {
      if (c.address !== contact.address) {
        if (byId.has(c.address)) {
          return toast({
            status: "warning",
            title: "Contact",
            description: "Contact with this address already exists",
          })
        }
        deleteContact(contact.address)
      }
      updateContact(c.address, c)
      toast({
        status: "success",
        title: "Contact",
        description: "Contact was updated",
      })
      return onClose()
    }
    if (byId.has(c.address)) {
      return toast({
        status: "warning",
        title: "Create Contact",
        description: "Address already exists",
      })
    }
    updateContact(c.address, c)
    toast({
      status: "success",
      title: "Contact",
      description: "Contact was created",
    })
    onClose()
  }

  return (
    <>
      {children(onOpen)}
      <ContactFormModal
        header={header}
        contact={contact}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  )
}

export function ContactFormModal({
  isOpen,
  onClose,
  contact,
  header,
  footer,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  header?: string
  footer?: React.ReactNode
  contact?: Contact
  onSubmit: (c: Contact) => void
}) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [formValues, setFormValues] = React.useState({ name: "", address: "" })

  function _onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    const { name: nameInput, address: addressInput } = (
      e.target as HTMLFormElement
    ).elements as FormElements

    const name = nameInput.value.trim()
    const address = addressInput.value.trim()

    if (!name || !address) return

    onSubmit({ name, address })
  }

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    const { name, value } = e.target as HTMLInputElement
    setFormValues(s => ({ ...s, [name]: value }))
  }

  React.useEffect(() => {
    isOpen && contact && setFormValues({ ...contact })

    !isOpen && setFormValues({ name: "", address: "" })
  }, [isOpen, contact])

  return (
    <>
      <Modal
        header={header ?? "Contact"}
        isOpen={isOpen}
        onClose={onClose}
        footer={
          footer ?? (
            <Button
              form="contact-form"
              type="submit"
              w={{ base: "full", md: "auto" }}
            >
              Save
            </Button>
          )
        }
      >
        <Modal.Body>
          <form onSubmit={_onSubmit} ref={formRef} id="contact-form">
            <VStack>
              <FormControl isRequired id="name">
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  variant="filled"
                  maxLength={75}
                  minLength={1}
                  value={formValues.name}
                  autoFocus
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired id="address">
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  variant="filled"
                  value={formValues.address}
                  maxLength={100}
                  minLength={50}
                  onChange={handleChange}
                  isTruncated
                  fontFamily="monospace"
                />
              </FormControl>
            </VStack>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export function RemoveContactDialog({
  contact,
  children,
}: {
  contact: Contact
  children: (onOpen: () => void) => void
}) {
  const toast = useToast()
  const deleteContact = useContactsStore(s => s.deleteContact)
  const cancelRef = React.useRef(null)
  const { onOpen, isOpen, onClose } = useDisclosure()

  function onRemove(e: React.FormEvent<HTMLButtonElement>) {
    e.stopPropagation()
    deleteContact(contact!.address)
    toast({
      status: "success",
      title: "Contact",
      description: "Contact was removed",
    })
  }

  return (
    <>
      {children(onOpen)}
      <AlertDialog
        header="Confirm"
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialog.Body>
          <Text>Remove this contact?</Text>
          <Text fontSize="lg" fontWeight="medium">
            {contact!.name}
          </Text>
          <Text fontSize="md" fontFamily="monospace">
            {contact!.address}
          </Text>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <ButtonGroup w="full" justifyContent="flex-end">
            <Button
              width={{ base: "full", md: "auto" }}
              onClick={onClose}
              ref={cancelRef}
              type="submit"
            >
              Cancel
            </Button>
            <Button
              width={{ base: "full", md: "auto" }}
              colorScheme="red"
              onClick={onRemove}
            >
              Remove
            </Button>
          </ButtonGroup>
        </AlertDialog.Footer>
      </AlertDialog>
    </>
  )
}
