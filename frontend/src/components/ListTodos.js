import { Box, Button, Container, FormControl, Heading, HStack, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Text, Textarea, useColorModeValue, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { IoReturnUpBack } from "react-icons/io5";

import InputTodo from "./InputTodo";

const ListTodos = () => {

    const [todos, setTodos] = useState([]);
    const [updatedTodo, setUpdatedTodo] = useState({
        title: "",
        description: "",
        isCompleted: false
    });

    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

    const getTodos = async () => {
        try{
            const response = await fetch("/todos");
            const jsonData = await response.json();

            setTodos(jsonData.data);

        } catch (err) {
            console.error(err.message);
        }
    }

    const deleteTodo = async (id) => {
        try{
            await fetch(`/todos/${id}`, {
                method: "DELETE"
            });

            toast({
                title: "Success",
                description: "Task was deleted",
                status: "success",
                isClosable: true
            });

            setTodos(todos.filter( todo => todo.id !== id));

        } catch (err) {
            console.error(err.message);
            toast({
                title: "Error",
                description: "Task couldn't be deleted",
                status: "error",
                isClosable: true
            });
        }
    } 

   const completeTodo = async (id, todo) => {
        try{
            const updatedTodo = { ...todo, isCompleted: !todo.isCompleted }
            await fetch (`/todos/${id}`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(updatedTodo)
            }); 
            
            setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));

        } catch (err) {
            console.error(err.message);
        }
    }

    const updateTodo = async () =>{
        try{
            await fetch(`/todos/${updatedTodo.id}`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(updatedTodo)
            });

            setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));

            toast({
                title: "Task updated",
                description: "Your task was successfully updated!",
                status: "success",
                isClosable: true,
            });
    
            onClose();
        } catch (err) {
            console.error(err.message);
        }
    }

    const textColor = useColorModeValue("gray.600", "gray.200");
    const bg = useColorModeValue("white", "gray.800");

    useEffect(() => {
        getTodos();
    }, []);

    const sortedTodos = [
        ...todos.filter((todo) => !todo.isCompleted), // Incomplete tasks first
        ...todos.filter((todo) => todo.isCompleted),  // Completed tasks second
    ];

    return (
    <>
        <Container maxW='container.xl' py={12}>
            <VStack spacing={8}>
            <Text
                fontSize={{base: "22", sm: "28"}}
                fontWeight={"bold"}
                textTransform={"uppercase"}
                textAlign={"center"}
                bgGradient={"linear(to-r, cyan.400, red.500)"}
                bgClip={"text"}
            >
                Tracking Tasks
            </Text>
            <SimpleGrid 
                columns={1}
                spacing={10}
            >
                {sortedTodos.map((todo) => (
                    <Box
                        shadow='lg'
                        rounded='lg'
                        overflow='hidden'
                        transition='all 0.3s'
                        _hover={{transform: "translateY(-5px)", shadow: "xl"}}
                        bg = {bg}
                        p={6}
                        key={todo.id}
                    >
                        <Heading 
                            as= "h2" 
                            size="md" 
                            mb={2}
                            textDecoration={todo.isCompleted ? "line-through red wavy 2px" : "none"}
                        >
                            {todo.title}
                        </Heading>
                        <Box>
                            <Text fontWeight='bold' fontSize='xl' color={textColor} mb={4}>
                                {todo.description}
                            </Text>
                            <HStack spacing={2}>
                                <IconButton icon={todo.isCompleted ? <IoReturnUpBack /> : <FaCheckCircle />} colorScheme={todo.isCompleted ? "pink" : "green"} onClick={ () => completeTodo(todo.id, todo)} />
                                <IconButton icon={<FiEdit3 />} colorScheme="blue" onClick={ () => {setUpdatedTodo(todo); onOpen()}} fontSize={25}/>
                                <IconButton icon={<MdDeleteOutline />} colorScheme="red" onClick={() => deleteTodo(todo.id)}/>
                            </HStack>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>
            </VStack>
            {todos.length === 0 && (             
                <Text fontSize='xl' textAlign={"center"} fontWeight="bold" color="gray.500">
                    You have no tasks 😃!{" "}
                    <>
                        <Text as="span" color="blue.500" _hover={{textDecoration: "underline"}} onClick={onCreateOpen}>
                            Create a Task <Icon mb={1} fontSize={25}><CiSquarePlus /></Icon>
                        </Text>
                    </>
                </Text>
            )}
        </Container>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Todo</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl>
                                <Input 
                                    placeholder = 'Task Title'
                                    name="title"
                                    value={updatedTodo.title}
                                    onChange={(e) => setUpdatedTodo({ ...updatedTodo, title: e.target.value })}
                                />
                            </FormControl>
                            <FormControl>
                                <Textarea 
                                    placeholder = 'Task Description (optional)'
                                    name="description"
                                    value={updatedTodo.description}
                                    onChange={(e) => setUpdatedTodo({ ...updatedTodo, description: e.target.value })}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={() => updateTodo()} mr={3}>
                            Update
                        </Button>
                        <Button variant='ghost' onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
        </Modal>
        <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
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

export default ListTodos;