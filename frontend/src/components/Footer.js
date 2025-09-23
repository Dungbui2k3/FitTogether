import { Box, Container, Stack, Text, Link, Flex, Divider } from "@chakra-ui/react"

const Footer = () => {
  return (
    <Box bg="gray.900" color="white" mt="auto">
      <Container maxW="6xl" py={10}>
        <Stack spacing={8}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "start", md: "start" }}
            spacing={8}
          >
            <Stack spacing={4} flex={1}>
              <Text fontSize="2xl" fontWeight="bold" color="brand.400">
                FIT TOGETHER
              </Text>
              <Text fontSize="sm" color="gray.400" maxW="300px">
                Cửa hàng thể thao chuyên nghiệp cung cấp đồ cầu lông và pickleball chất lượng cao.
              </Text>
            </Stack>

            <Stack spacing={4} flex={1}>
              <Text fontWeight="bold">Sản phẩm</Text>
              <Stack spacing={2} fontSize="sm" color="gray.400">
                <Link>Vợt cầu lông</Link>
                <Link>Vợt pickleball</Link>
                <Link>Giày thể thao</Link>
                <Link>Phụ kiện</Link>
              </Stack>
            </Stack>

            <Stack spacing={4} flex={1}>
              <Text fontWeight="bold">Hỗ trợ</Text>
              <Stack spacing={2} fontSize="sm" color="gray.400">
                <Link>Liên hệ</Link>
                <Link>Chính sách đổi trả</Link>
                <Link>Hướng dẫn mua hàng</Link>
                <Link>FAQ</Link>
              </Stack>
            </Stack>

            <Stack spacing={4} flex={1}>
              <Text fontWeight="bold">Liên hệ</Text>
              <Stack spacing={2} fontSize="sm" color="gray.400">
                <Text>📧 info@fittogether.com</Text>
                <Text>📞 0123 456 789</Text>
                <Text>📍 123 Đường ABC, TP.HCM</Text>
              </Stack>
            </Stack>
          </Flex>

          <Divider borderColor="gray.700" />

          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            fontSize="sm"
            color="gray.400"
          >
            <Text>© 2025 Fit Together. Tất cả quyền được bảo lưu.</Text>
            <Stack direction="row" spacing={4}>
              <Link>Điều khoản sử dụng</Link>
              <Link>Chính sách bảo mật</Link>
            </Stack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
