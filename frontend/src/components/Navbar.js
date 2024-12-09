import { Button, Container, Flex, HStack, Icon, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useColorMode, useDisclosure } from "@chakra-ui/react";
import { CiSquarePlus } from "react-icons/ci";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import React from "react";

//component
 import InputTodo from "./InputTodo";

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
    <>
        <Container px={4}>
            <Flex
                h={16}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={{
                    base:"column",
                    sm:"row"
                }}
            >
                <Text
                    fontSize={{base: "22", sm: "28"}}
                    fontWeight={"bold"}
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    bgGradient={"linear(to-r, cyan.400, red.500)"}
                    bgClip={"text"}
                >
                    SAP Todo list
                </Text>
                <HStack spacing={2} alignItems={"center"}>
                    <IconButton icon={<CiSquarePlus />} onClick={onOpen} fontSize={25}/>
                    <Button onClick={toggleColorMode}>
                        <Icon fontSize={25}>
                            {colorMode === "light" ? <IoMoon /> : <LuSun />}
                        </Icon>
                    </Button>
                </HStack>
            </Flex>
        </Container>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <InputTodo />
                    </ModalBody>
                </ModalContent>
        </Modal>
    </>

    )
};

export default Navbar;