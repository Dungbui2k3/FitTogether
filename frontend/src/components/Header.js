"use client"

import React from "react"
import { Box, Flex, Text, Button, Stack, Link, Badge, IconButton } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons"

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Box bg="white" px={4} shadow="md" position="sticky" top={0} zIndex={1000}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" color="brand.600" as={RouterLink} to="/">
          FIT TOGETHER
        </Text>

        <Flex alignItems="center" display={{ base: "none", md: "flex" }}>
          <Stack direction="row" spacing={7}>
            <Link as={RouterLink} to="/" fontWeight="medium">
              Trang chủ
            </Link>
            <Link as={RouterLink} to="/products" fontWeight="medium">
              Sản phẩm
            </Link>
            <Link fontWeight="medium">Về chúng tôi</Link>
            <Link fontWeight="medium">Liên hệ</Link>
          </Stack>
        </Flex>

        <Flex alignItems="center">
          <Button as={RouterLink} to="/cart" variant="ghost" mr={3} position="relative">
            🛒
            <Badge colorScheme="red" position="absolute" top="-1" right="-1" fontSize="xs">
              2
            </Badge>
          </Button>

          <Stack direction="row" spacing={3} display={{ base: "none", md: "flex" }}>
            <Button as={RouterLink} to="/login" variant="ghost">
              Đăng nhập
            </Button>
            <Button as={RouterLink} to="/register" colorScheme="brand">
              Đăng ký
            </Button>
          </Stack>

          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={() => setIsOpen(!isOpen)}
          />
        </Flex>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4}>
            <Link as={RouterLink} to="/">
              Trang chủ
            </Link>
            <Link as={RouterLink} to="/products">
              Sản phẩm
            </Link>
            <Link>Về chúng tôi</Link>
            <Link>Liên hệ</Link>
            <Button as={RouterLink} to="/login" variant="ghost" size="sm">
              Đăng nhập
            </Button>
            <Button as={RouterLink} to="/register" colorScheme="brand" size="sm">
              Đăng ký
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default Header
