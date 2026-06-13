package com.preventech.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.preventech.backend.entities.Usuario;
import com.preventech.backend.enums.Rol;
import com.preventech.backend.repositories.UsuarioRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioServiceImpl usuarioServices;

    private Usuario usuario1;
    private Usuario usuario2;

    @BeforeEach
    public void setup() {
        usuario1 = new Usuario();
        usuario1.setId(1L);
        usuario1.setNombre("Carlos");
        usuario1.setEmail("carlos@gmail.com");
        usuario1.setPassword("Hash123!");
        usuario1.setRol(Rol.ADMINISTRADOR);

        usuario2 = new Usuario();
        usuario2.setId(2L);
        usuario2.setNombre("Ana");
        usuario2.setEmail("ana@gmail.com");
        usuario2.setPassword("Hash456!");
        usuario2.setRol(Rol.TECNICO);
    }

    @Test
    public void crear_debeHashearContrasena() {
        when(passwordEncoder.encode("Clave123!")).thenReturn("HASHED_PASS");
        when(usuarioRepository.existsByEmail("nuevo@gmail.com")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        Usuario nuevo = new Usuario();
        nuevo.setNombre("Luis");
        nuevo.setEmail("nuevo@gmail.com");
        nuevo.setPassword("Clave123!");

        Usuario creado = usuarioServices.crear(nuevo);

        assertNotNull(creado);
        assertEquals("HASHED_PASS", creado.getPassword());
        verify(passwordEncoder, times(1)).encode("Clave123!");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    public void crear_debeNormalizarEmailAMinusculas() {
        when(usuarioRepository.existsByEmail("nuevo@gmail.com")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        Usuario nuevo = new Usuario();
        nuevo.setNombre("Luis");
        nuevo.setEmail("NUEVO@gmail.com");

        Usuario creado = usuarioServices.crear(nuevo);

        assertEquals("nuevo@gmail.com", creado.getEmail());
    }

    @Test
    public void crear_conCorreoNoGmail_debeLanzarRuntimeException() {
        Usuario nuevo = new Usuario();
        nuevo.setNombre("Luis");
        nuevo.setEmail("luis@hotmail.com");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> usuarioServices.crear(nuevo));

        assertEquals("Solo se permiten correos @gmail.com", ex.getMessage());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    public void crear_conCorreoDuplicado_debeLanzarRuntimeException() {
        when(usuarioRepository.existsByEmail("carlos@gmail.com")).thenReturn(true);

        Usuario nuevo = new Usuario();
        nuevo.setNombre("Otro");
        nuevo.setEmail("carlos@gmail.com");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> usuarioServices.crear(nuevo));

        assertEquals("El correo ya está registrado", ex.getMessage());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    public void obtenerId_existente_debeRetornarUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));

        Usuario resultado = usuarioServices.obtenerId(1L);

        assertNotNull(resultado);
        assertEquals("Carlos", resultado.getNombre());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    public void obtenerId_noExistente_debeLanzarRuntimeException() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> usuarioServices.obtenerId(99L));

        assertEquals("Usuario no encontrado", ex.getMessage());
        verify(usuarioRepository, times(1)).findById(99L);
    }

    @Test
    public void listarTodos_debeRetornarListaDeUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario1, usuario2));

        List<Usuario> lista = usuarioServices.listarTodos();

        assertEquals(2, lista.size());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    public void eliminar_usuarioTecnico_debeEliminarSinError() {
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(usuario2));
        doNothing().when(usuarioRepository).delete(usuario2);

        assertDoesNotThrow(() -> usuarioServices.eliminar(2L));
        verify(usuarioRepository, times(1)).delete(usuario2);
    }

    @Test
    public void eliminar_noExistente_debeLanzarRuntimeException() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> usuarioServices.eliminar(99L));

        assertEquals("Usuario no encontrado", ex.getMessage());
        verify(usuarioRepository, never()).delete(any(Usuario.class));
    }

    @Test
    public void eliminar_ultimoAdministrador_debeLanzarRuntimeException() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario1));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> usuarioServices.eliminar(1L));

        assertEquals("No se puede eliminar el último administrador", ex.getMessage());
        verify(usuarioRepository, never()).delete(any(Usuario.class));
    }

    @Test
    public void eliminar_administradorCuandoHayOtro_debeEliminarSinError() {
        Usuario otroAdmin = new Usuario();
        otroAdmin.setId(3L);
        otroAdmin.setRol(Rol.ADMINISTRADOR);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario1, otroAdmin));
        doNothing().when(usuarioRepository).delete(usuario1);

        assertDoesNotThrow(() -> usuarioServices.eliminar(1L));
        verify(usuarioRepository, times(1)).delete(usuario1);
    }

    @Test
    public void actualizar_debeGuardarConCambiosDeNombre() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArgument(0));

        Usuario cambios = new Usuario();
        cambios.setNombre("Carlos Actualizado");

        Usuario actualizado = usuarioServices.actualizar(1L, cambios);

        assertEquals("Carlos Actualizado", actualizado.getNombre());
        assertEquals("carlos@gmail.com", actualizado.getEmail());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    public void actualizar_conNuevoEmailValido_debeActualizarEmail() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        when(usuarioRepository.existsByEmail("nuevo@gmail.com")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArgument(0));

        Usuario cambios = new Usuario();
        cambios.setEmail("nuevo@gmail.com");

        Usuario actualizado = usuarioServices.actualizar(1L, cambios);

        assertEquals("nuevo@gmail.com", actualizado.getEmail());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    public void actualizar_conEmailNoGmail_debeLanzarRuntimeException() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));

        Usuario cambios = new Usuario();
        cambios.setEmail("nuevo@hotmail.com");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> usuarioServices.actualizar(1L, cambios));

        assertEquals("Solo se permiten correos @gmail.com", ex.getMessage());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    public void actualizar_conEmailDuplicado_debeLanzarRuntimeException() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        when(usuarioRepository.existsByEmail("ana@gmail.com")).thenReturn(true);

        Usuario cambios = new Usuario();
        cambios.setEmail("ana@gmail.com");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> usuarioServices.actualizar(1L, cambios));

        assertEquals("El correo ya está registrado", ex.getMessage());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    public void actualizar_debeHashearNuevaContrasena() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario1));
        when(passwordEncoder.encode("NuevaClave1!")).thenReturn("HASHED_NEW");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(i -> i.getArgument(0));

        Usuario cambios = new Usuario();
        cambios.setPassword("NuevaClave1!");

        Usuario actualizado = usuarioServices.actualizar(1L, cambios);

        assertEquals("HASHED_NEW", actualizado.getPassword());
        verify(passwordEncoder, times(1)).encode("NuevaClave1!");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }
}