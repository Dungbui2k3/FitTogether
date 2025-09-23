import {
  Box,
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Link,
  Divider,
  Flex,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

const Login = () => {
  return (
    <Container maxW="md" py={12}>
      <Card>
        <CardBody p={8}>
          <Stack spacing={6}>
            <Box textAlign="center">
              <Heading fontSize="2xl" mb={2}>
                Đăng nhập
              </Heading>
              <Text color="gray.600">Chào mừng bạn quay trở lại Fit Together</Text>
            </Box>

            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Nhập email của bạn" size="lg" />
              </FormControl>

              <FormControl>
                <FormLabel>Mật khẩu</FormLabel>
                <Input type="password" placeholder="Nhập mật khẩu" size="lg" />
              </FormControl>

              <Flex justify="space-between" align="center">
                <Link fontSize="sm" color="brand.600">
                  Quên mật khẩu?
                </Link>
              </Flex>

              <Button colorScheme="brand" size="lg" w="full">
                Đăng nhập
              </Button>
            </Stack>

            <Divider />

            <Text textAlign="center" fontSize="sm">
              Chưa có tài khoản?{" "}
              <Link as={RouterLink} to="/register" color="brand.600" fontWeight="medium">
                Đăng ký ngay
              </Link>
            </Text>
          </Stack>
        </CardBody>
      </Card>
    </Container>
  )
}

export default Login
