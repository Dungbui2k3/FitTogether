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
  Checkbox,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"

const Register = () => {
  return (
    <Container maxW="md" py={12}>
      <Card>
        <CardBody p={8}>
          <Stack spacing={6}>
            <Box textAlign="center">
              <Heading fontSize="2xl" mb={2}>
                Đăng ký tài khoản
              </Heading>
              <Text color="gray.600">Tạo tài khoản để trải nghiệm mua sắm tốt nhất</Text>
            </Box>

            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Họ và tên</FormLabel>
                <Input placeholder="Nhập họ và tên" size="lg" />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Nhập email của bạn" size="lg" />
              </FormControl>

              <FormControl>
                <FormLabel>Số điện thoại</FormLabel>
                <Input type="tel" placeholder="Nhập số điện thoại" size="lg" />
              </FormControl>

              <FormControl>
                <FormLabel>Mật khẩu</FormLabel>
                <Input type="password" placeholder="Tạo mật khẩu" size="lg" />
              </FormControl>

              <FormControl>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <Input type="password" placeholder="Nhập lại mật khẩu" size="lg" />
              </FormControl>

              <Checkbox>
                Tôi đồng ý với <Link color="brand.600">Điều khoản sử dụng</Link> và{" "}
                <Link color="brand.600">Chính sách bảo mật</Link>
              </Checkbox>

              <Button colorScheme="brand" size="lg" w="full">
                Đăng ký
              </Button>
            </Stack>

            <Divider />

            <Text textAlign="center" fontSize="sm">
              Đã có tài khoản?{" "}
              <Link as={RouterLink} to="/login" color="brand.600" fontWeight="medium">
                Đăng nhập ngay
              </Link>
            </Text>
          </Stack>
        </CardBody>
      </Card>
    </Container>
  )
}

export default Register
