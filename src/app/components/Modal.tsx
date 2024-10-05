import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React from 'react'


export default function ModalCustom({ modalTitle, isOpen, onClose, children }: { modalTitle: string, isOpen: boolean, onClose: () => void, children: React.ReactNode }) {

    return (

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{modalTitle}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {children}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>

                </ModalFooter>
            </ModalContent>
        </Modal>

    )
}
