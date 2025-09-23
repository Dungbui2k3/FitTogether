import {
  Box,
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Image,
  IconButton,
  Divider,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react"
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons"

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: "Vợt Cầu Lông Yonex Arcsaber 11",
      price: 3200000,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Giày Cầu Lông Victor SH-A922",
      price: 1800000,
      quantity: 1,
      image: "/victor-badminton-shoes.jpg",
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 50000
  const total = subtotal + shipping

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ"
  }

  return (
    <Container maxW="6xl" py={8}>
      <Stack spacing={8}>
        <Heading fontSize="3xl">Giỏ hàng ({cartItems.length} sản phẩm)</Heading>

        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
          {/* Cart Items */}
          <Box gridColumn={{ base: 1, lg: "1 / 3" }}>
            <Stack spacing={4}>
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardBody>
                    <Flex gap={4} align="center">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                      />

                      <Box flex={1}>
                        <Heading size="sm" mb={2}>
                          {item.name}
                        </Heading>
                        <Text color="brand.600" fontWeight="bold" fontSize="lg">
                          {formatPrice(item.price)}
                        </Text>
                      </Box>

                      <Flex align="center" gap={3}>
                        <IconButton size="sm" icon={<MinusIcon />} variant="outline" />
                        <Text fontWeight="bold" minW="40px" textAlign="center">
                          {item.quantity}
                        </Text>
                        <IconButton size="sm" icon={<AddIcon />} variant="outline" />
                      </Flex>

                      <IconButton icon={<DeleteIcon />} colorScheme="red" variant="ghost" size="sm" />
                    </Flex>
                  </CardBody>
                </Card>
              ))}

              {cartItems.length === 0 && (
                <Card>
                  <CardBody textAlign="center" py={12}>
                    <Text fontSize="lg" color="gray.500" mb={4}>
                      Giỏ hàng của bạn đang trống
                    </Text>
                    <Button colorScheme="brand">Tiếp tục mua sắm</Button>
                  </CardBody>
                </Card>
              )}
            </Stack>
          </Box>

          {/* Order Summary */}
          <Box>
            <Card position="sticky" top={4}>
              <CardBody>
                <Stack spacing={4}>
                  <Heading size="md">Tóm tắt đơn hàng</Heading>

                  <Stack spacing={3}>
                    <Flex justify="space-between">
                      <Text>Tạm tính:</Text>
                      <Text>{formatPrice(subtotal)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>Phí vận chuyển:</Text>
                      <Text>{formatPrice(shipping)}</Text>
                    </Flex>
                    <Divider />
                    <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                      <Text>Tổng cộng:</Text>
                      <Text color="brand.600">{formatPrice(total)}</Text>
                    </Flex>
                  </Stack>

                  <Stack spacing={3}>
                    <Button colorScheme="brand" size="lg" w="full">
                      Thanh toán
                    </Button>
                    <Button variant="outline" w="full">
                      Tiếp tục mua sắm
                    </Button>
                  </Stack>

                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Chúng tôi chấp nhận:
                    </Text>
                    <Flex gap={2}>
                      <Badge>Visa</Badge>
                      <Badge>Mastercard</Badge>
                      <Badge>Momo</Badge>
                      <Badge>ZaloPay</Badge>
                    </Flex>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}

export default Cart
