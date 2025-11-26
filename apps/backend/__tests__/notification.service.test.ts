const service = require('../src/modules/notifications/notification.service');
const repository = require('../src/modules/notifications/notifications.repository');

jest.mock('../src/modules/notifications/notifications.repository');

describe('Notification service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('marcarComoLida should call repository.markAsRead when notification belongs to user', async () => {
    const fakeNotification = { id: 'n1', userId: 1 };
    repository.findById.mockResolvedValueOnce(fakeNotification);
    repository.markAsRead.mockResolvedValueOnce({ count: 1 });

    await expect(service.marcarComoLida(1, 'n1')).resolves.toEqual({ count: 1 });

    expect(repository.findById).toHaveBeenCalledWith('n1');
    expect(repository.markAsRead).toHaveBeenCalledWith('n1', 1);
  });

  test('marcarComoLida should throw when notification not found', async () => {
    repository.findById.mockResolvedValueOnce(null);

    await expect(service.marcarComoLida(1, 'not-exists')).rejects.toThrow('Notificação não encontrada');
  });

  test('marcarComoLida should throw when notification belongs to another user', async () => {
    const fakeNotification = { id: 'n2', userId: 2 };
    repository.findById.mockResolvedValueOnce(fakeNotification);

    await expect(service.marcarComoLida(1, 'n2')).rejects.toThrow('Acesso negado');
  });
});

