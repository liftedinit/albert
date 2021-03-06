import {
  Button,
  Checkbox,
  Modal,
  OptionCard,
  useDisclosure,
  VStack,
} from "components"

type Props = {
  onRoleClicked: (onClose: () => void, roles: string[]) => void
  rolesList: Role[]
  selectedRoles: string[]
  children: (onOpen: () => void) => void
}

export function RolesSelector({
  selectedRoles,
  onRoleClicked,
  rolesList = [],
  children,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {children(onOpen)}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        footer={
          <>
            <Button onClick={onClose}>Done</Button>
          </>
        }
        header="Roles"
        scrollBehavior="inside"
      >
        <Modal.Body pt={0}>
          <RolesList
            rolesList={rolesList}
            selectedRoles={selectedRoles}
            onRoleSelected={(r: string) => {
              const shouldRemove = selectedRoles.includes(r)
              let result = selectedRoles.slice()
              result = shouldRemove
                ? result.filter(role => role !== r)
                : result.concat(r)
              onRoleClicked(onClose, result)
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}

export type Role = { label: string; description: string; value: string }

function RolesList({
  onRoleSelected,
  selectedRoles,
  rolesList,
}: {
  onRoleSelected: (roles: string) => void
  selectedRoles: string[]
  rolesList: Role[]
}) {
  return (
    <VStack alignItems="flex-start">
      {rolesList.map(role => {
        const checked = selectedRoles.includes(role.value)
        return (
          <OptionCard
            key={role.label}
            label={role.label}
            description={role.description}
          >
            <Checkbox
              colorScheme="brand.teal"
              aria-label="account multisig feature"
              isChecked={checked}
              onChange={() => onRoleSelected(role.value)}
            />
          </OptionCard>
        )
      })}
    </VStack>
  )
}
